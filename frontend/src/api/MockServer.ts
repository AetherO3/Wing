import { AxiosError } from "axios";
import type { AxiosResponse, InternalAxiosRequestConfig } from "axios";
import seed from "./seed.json";

type User = { id: number; userName: string; email: string };
type Group = { id: number; name: string; topic: string; creatorId: number };
type Member = { groupId: number; userId: number };
type Msg = {
    id: number; groupId: number; parentId: number | null; authorId: number;
    stance: string; edited: boolean; createDateTime: string; message: string;
};
type Vote = { userId: number; messageId: number; stance: string };
type Db = {
    currentUserId: number; users: User[]; groups: Group[];
    members: Member[]; messages: Msg[]; votes: Vote[];
};

const db = structuredClone(seed) as unknown as Db;
let loggedIn = true;

class HttpError extends Error {
    status: number;
    constructor(status: number, message: string) {
        super(message);
        this.status = status;
    }
}

const nextId = (list: { id: number }[]) => Math.max(0, ...list.map((x) => x.id)) + 1;
const userName = (id: number) => db.users.find((u) => u.id === id)?.userName ?? "unknown";

function getGroup(id: number): Group {
    const g = db.groups.find((x) => x.id === id);
    if (!g) throw new HttpError(404, "Group not found");
    return g;
}
function getMsg(id: number): Msg {
    const m = db.messages.find((x) => x.id === id);
    if (!m) throw new HttpError(404, "Message not found");
    return m;
}

const toGroupDTO = (g: Group) => ({ ...g, creatorName: userName(g.creatorId) });

function toMessageDTO(m: Msg) {
    const votes = db.votes.filter((v) => v.messageId === m.id);
    return { id: m.id, parentId: m.parentId, authorId: m.authorId, authorName: userName(m.authorId), message: m.message, stance: m.stance, edited: m.edited,
        replyCount: db.messages.filter((x) => x.parentId === m.id).length, agreeCount: votes.filter((v) => v.stance === "PRO").length, disagreeCount: votes.filter((v) => v.stance === "AGAINST").length,
        myVote: votes.find((v) => v.userId === db.currentUserId)?.stance ?? null, createDateTime: m.createDateTime, };
}

function removeMessage(id: number) {
    db.messages.filter((m) => m.parentId === id).forEach((m) => removeMessage(m.id));
    db.messages = db.messages.filter((m) => m.id !== id);
    db.votes = db.votes.filter((v) => v.messageId !== id);
}

function castVote(messageId: number, stance: string) {
    getMsg(messageId);
    const existing = db.votes.find((v) => v.userId === db.currentUserId && v.messageId === messageId);
    if (!existing) db.votes.push({ userId: db.currentUserId, messageId, stance });
    else if (existing.stance === stance) db.votes = db.votes.filter((v) => v !== existing);
    else existing.stance = stance;
    const votes = db.votes.filter((v) => v.messageId === messageId);
    return {
        agreeCount: votes.filter((v) => v.stance === "PRO").length,
        disagreeCount: votes.filter((v) => v.stance === "AGAINST").length,
    };
}

type Ctx = { p: number[]; query: URLSearchParams; body: Record<string, unknown> };
type Route = { method: string; pattern: RegExp; handler: (c: Ctx) => unknown };
const routes: Route[] = [];
const route = (method: string, pattern: RegExp, handler: Route["handler"]) => routes.push({ method, pattern, handler });

route("POST", /^\/auth\/login$/, () => { loggedIn = true; return {}; });
route("POST", /^\/auth\/logout$/, () => { loggedIn = false; return {}; });

route("GET", /^\/api\/users\/me$/, () => db.users.find((u) => u.id === db.currentUserId));
route("GET", /^\/api\/users\/(\d+)$/, ({ p }) => {
    const u = db.users.find((x) => x.id === p[0]);
    if (!u) throw new HttpError(404, "User not found");
    return u;
});
route("POST", /^\/api\/users$/, ({ body }) => {
    const u = { id: nextId(db.users), userName: String(body.userName), email: String(body.email) };
    db.users.push(u);
    return u;
});
route("PUT", /^\/api\/users\/update\/(\d+)$/, ({ p, body }) => {
    const u = db.users.find((x) => x.id === p[0]);
    if (!u) throw new HttpError(404, "User not found");
    if (body.userName) u.userName = String(body.userName);
    if (body.email) u.email = String(body.email);
    return u;
});
route("PATCH", /^\/api\/users\/(\d+)$/, () => ({}));
route("DELETE", /^\/api\/users\/(\d+)$/, () => ({}));

route("GET", /^\/api\/groups\/search$/, ({ query }) => {
    const q = (query.get("name") ?? "").toLowerCase();
    const content = db.groups.filter((g) => g.name.toLowerCase().includes(q)).map(toGroupDTO);
    return { content, totalElements: content.length, totalPages: 1, number: 0, size: 20 };
});
route("GET", /^\/api\/groups\/joinedGroups$/, () => {
    const ids = db.members.filter((m) => m.userId === db.currentUserId).map((m) => m.groupId);
    return db.groups.filter((g) => ids.includes(g.id)).map(toGroupDTO);
});
route("GET", /^\/api\/groups\/(\d+)$/, ({ p }) => toGroupDTO(getGroup(p[0])));
route("POST", /^\/api\/groups\/create$/, ({ body }) => {
    const g = { id: nextId(db.groups), name: String(body.name), topic: String(body.topic), creatorId: db.currentUserId };
    db.groups.push(g);
    db.members.push({ groupId: g.id, userId: db.currentUserId });
    return toGroupDTO(g);
});
route("PATCH", /^\/api\/groups\/update\/(\d+)$/, ({ p, body }) => {
    const g = getGroup(p[0]);
    if (body.name) g.name = String(body.name);
    if (body.topic) g.topic = String(body.topic);
    return toGroupDTO(g);
});
route("DELETE", /^\/api\/groups\/delete\/(\d+)$/, ({ p }) => {
    getGroup(p[0]);
    db.messages.filter((m) => m.groupId === p[0] && m.parentId === null).forEach((m) => removeMessage(m.id));
    db.groups = db.groups.filter((g) => g.id !== p[0]);
    db.members = db.members.filter((m) => m.groupId !== p[0]);
    return {};
});
route("POST", /^\/api\/groups\/(\d+)\/addMember$/, ({ p }) => {
    getGroup(p[0]);
    if (!db.members.some((m) => m.groupId === p[0] && m.userId === db.currentUserId))
        db.members.push({ groupId: p[0], userId: db.currentUserId });
    return {};
});
route("DELETE", /^\/api\/groups\/(\d+)\/leaveGroup$/, ({ p }) => {
    db.members = db.members.filter((m) => !(m.groupId === p[0] && m.userId === db.currentUserId));
    return {};
});

route("GET", /^\/api\/messages\/group\/(\d+)$/, ({ p }) =>
    db.messages.filter((m) => m.groupId === p[0] && m.parentId === null).map(toMessageDTO));
route("GET", /^\/api\/messages\/replies\/(\d+)$/, ({ p }) =>
    db.messages.filter((m) => m.parentId === p[0]).map(toMessageDTO));
route("GET", /^\/api\/messages\/groupid\/(\d+)$/, ({ p }) => getMsg(p[0]).groupId);
route("GET", /^\/api\/messages\/(\d+)$/, ({ p }) => toMessageDTO(getMsg(p[0])));
route("POST", /^\/api\/messages$/, ({ body }) => {
    const m: Msg = {
        id: nextId(db.messages),
        groupId: Number(body.groupId),
        parentId: body.parentId ? Number(body.parentId) : null,
        authorId: db.currentUserId,
        stance: String(body.stance).toUpperCase(),
        edited: false,
        createDateTime: new Date().toISOString().slice(0, 19),
        message: String(body.message),
    };
    db.messages.push(m);
    return toMessageDTO(m);
});
route("DELETE", /^\/api\/messages\/(\d+)$/, ({ p }) => { getMsg(p[0]); removeMessage(p[0]); return {}; });
route("POST", /^\/api\/messages\/edit\/message\/(\d+)$/, ({ p, body }) => {
    const m = getMsg(p[0]);
    m.message = String(body.newMessage);
    m.edited = true;
    return {};
});
route("POST", /^\/api\/messages\/edit\/stance\/(\d+)$/, ({ p, body }) => {
    getMsg(p[0]).stance = String(body.raw ?? "").replace(/"/g, "").toUpperCase();
    return {};
});

route("GET", /^\/api\/messagevote\/agreers\/(\d+)$/, ({ p }) =>
    db.votes.filter((v) => v.messageId === p[0] && v.stance === "PRO").length);
route("GET", /^\/api\/messagevote\/disagreers\/(\d+)$/, ({ p }) =>
    db.votes.filter((v) => v.messageId === p[0] && v.stance === "AGAINST").length);
route("POST", /^\/api\/messagevote\/addAgree$/, ({ query }) => castVote(Number(query.get("messageId")), "PRO"));
route("POST", /^\/api\/messagevote\/addDisagree$/, ({ query }) => castVote(Number(query.get("messageId")), "AGAINST"));
route("GET", /^\/api\/messagevote\/myVote\/(\d+)$/, ({ p }) =>
    db.votes.find((v) => v.userId === db.currentUserId && v.messageId === p[0])?.stance ?? null);

function respond(config: InternalAxiosRequestConfig, status: number, data: unknown): AxiosResponse {
    return { data, status, statusText: status === 200 ? "OK" : "Error", headers: {}, config, request: {} };
}

export async function mockAdapter(config: InternalAxiosRequestConfig): Promise<AxiosResponse> {
    await new Promise((resolve) => setTimeout(resolve, 150));

    const url = new URL(config.url ?? "", "http://mock");
    const method = (config.method ?? "get").toUpperCase();
    const query = url.searchParams;
    for (const [k, v] of Object.entries(config.params ?? {})) query.set(k, String(v));

    let body: Record<string, unknown> = {};
    if (typeof config.data === "string" && config.data !== "") {
        try {
            const parsed: unknown = JSON.parse(config.data);
            body = typeof parsed === "object" && parsed !== null ? (parsed as Record<string, unknown>) : { raw: parsed };
        } catch {
            body = { raw: config.data };
        }
    }

    try {
        const isPublic = url.pathname === "/auth/login" || (method === "POST" && url.pathname === "/api/users");
        if (!loggedIn && !isPublic) throw new HttpError(401, "Not logged in");

        for (const r of routes) {
            const match = r.method === method ? url.pathname.match(r.pattern) : null;
            if (match) {
                const data = r.handler({ p: match.slice(1).map(Number), query, body });
                return respond(config, 200, data);
            }
        }
        throw new HttpError(404, `No demo route for ${method} ${url.pathname}`);
    } catch (e) {
        const status = e instanceof HttpError ? e.status : 500;
        const message = e instanceof Error ? e.message : "Demo error";
        throw new AxiosError(message, AxiosError.ERR_BAD_REQUEST, config, {}, respond(config, status, { message }));
    }
}
