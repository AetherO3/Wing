# Wing

---

A straight to the point way to get and share opinions on topics, with the design in mind to avoid the groups from becoming echo chambers.

**Live link:** https://wing-w3ei.onrender.com
**No signup needed:** click **Try demo** on the login page.

---

### Features

- Sign up, log in, and manage your account.
- Create and join debate groups.
- Threaded messages with a agree or disagree stance.
- Vote on messages (click again to undo, click the other side to switch).
- Search groups by name.
- Demo mode that runs entirely in the browser.

---

### Tech stack

| Layer | Tools |
|---|---|
| Frontend | React 19, TypeScript, Vite, React Router, Axios |
| Backend | Java 21, Spring Boot 4, Spring Security, Spring Data JPA |
| Database | PostgreSQL, schema managed by Flyway migrations |
| Auth | JWT (jjwt) in an HttpOnly cookie, BCrypt password hashing |
| Other | Bucket4j (rate limiting), springdoc OpenAPI, Spring Actuator |
| Infra | Docker and Docker Compose, GitHub Actions CI, Render |
