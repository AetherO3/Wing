package com.debateApp.Main.services;

import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.Optional;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.BadCredentialsException;

import com.debateApp.Main.dto.ChangePasswordDTO;
import com.debateApp.Main.dto.CreateUserDTO;
import com.debateApp.Main.dto.DeleteUserDTO;
import com.debateApp.Main.dto.UpdateUserDTO;
import com.debateApp.Main.dto.UserResponseDTO;
import com.debateApp.Main.entities.Users;
import com.debateApp.Main.exceptions.ResourceAlreadyExistsException;
import com.debateApp.Main.exceptions.ResourceNotFoundException;
import com.debateApp.Main.repositories.UserRepository;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordService passwordService;

    @InjectMocks
    private UserService userService;

    private static String userName = "Aether";
    private static String email = "aether@gmail.com";
    private static CreateUserDTO dto = CreateUserDTO.builder()
            .userName(userName)
            .email(email)
            .password("1234AbCd")
            .build();

    private Users existingUser() {
        Users user = new Users();
        user.setUserName("Aether");
        user.setEmail("aether@gmail.com");
        user.setPasswordHash("stored-hash");
        return user;
    }

    @Test
    void userNameAlreadyInUseThrowResourceAlreadyExistsException() {
        when(userRepository.existsByUserName(userName)).thenReturn(true);

        assertThatThrownBy(() -> userService.createUser(dto))
                .isInstanceOf(ResourceAlreadyExistsException.class)
                .hasMessage("Username already taken.");

        verify(userRepository, never()).save(any());
    }

    @Test
    void registeringWithATakenEmailIsRejected() {
        when(userRepository.existsByEmail(email)).thenReturn(true);

        assertThatThrownBy(() -> userService.createUser(dto))
                .isInstanceOf(ResourceAlreadyExistsException.class)
                .hasMessage("Email already taken.");

        verify(userRepository, never()).save(any());
    }

    @Test
    void validUserIsSavedWithHashedPassword() {
        when(passwordService.hashPassword(dto.getPassword())).thenReturn("hashed-pw");

        UserResponseDTO result = userService.createUser(dto);

        ArgumentCaptor<Users> captor = ArgumentCaptor.forClass(Users.class);

        verify(userRepository).save(captor.capture());

        Users saved = captor.getValue();

        assertEquals(dto.getUserName(), saved.getUserName());
        assertEquals(dto.getEmail(), saved.getEmail());
        assertEquals("hashed-pw", saved.getPasswordHash());
        assertEquals(dto.getUserName(), result.getUserName());
        assertEquals(dto.getEmail(), result.getEmail());
    }

    @Test
    void updatingAMissingUserIsRejected() {
        when(userRepository.findById(1L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> userService.updateUser(1L, new UpdateUserDTO("Aether", "aether@gmail.com")))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessage("User Not Found id:" + 1L);

        verify(userRepository, never()).save(any());
    }

    @Test
    void takingAlreadyUsedUserNameRejected() {
        when(userRepository.findById(1L)).thenReturn(Optional.of(existingUser()));

        when(userRepository.existsByUserName("ExistingName")).thenReturn(true);

        assertThatThrownBy(() -> userService.updateUser(1L, new UpdateUserDTO("ExistingName", "aether@gmail.com")))
                .isInstanceOf(ResourceAlreadyExistsException.class)
                .hasMessage("Username already taken.");

        verify(userRepository, never()).save(any());
    }

    @Test
    void takingAlreadyUsedEmailRejected() {
        when(userRepository.findById(1L)).thenReturn(Optional.of(existingUser()));

        when(userRepository.existsByEmail("existingemail@gmail.com")).thenReturn(true);

        assertThatThrownBy(
                () -> userService.updateUser(1L, new UpdateUserDTO("ExistingName", "existingemail@gmail.com")))
                .isInstanceOf(ResourceAlreadyExistsException.class)
                .hasMessage("Email already taken.");

        verify(userRepository, never()).save(any());
    }

    @Test
    void keepingYourOwnUsernameIsNotAConflict() {
        Users user = existingUser();

        when(userRepository.findById(1L)).thenReturn(Optional.of(user));

        when(userRepository.save(user)).thenReturn(user);

        UserResponseDTO response = userService.updateUser(1L, new UpdateUserDTO("Aether", "new@gmail.com"));

        assertEquals(response.getUserName(), "Aether");
        assertEquals(response.getEmail(), "new@gmail.com");

        verify(userRepository).save(user);
        verify(userRepository, never()).existsByUserName(any());
    }

    @Test
    void changingPasswordOfMissingUserRejected() {
        when(userRepository.findById(1L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> userService.changePassword(1L, new ChangePasswordDTO("1234AbCd", "AbCd1234")))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessage("User not found, id : " + 1L);

        verify(userRepository, never()).save(any());
    }

    @Test
    void wrongPasswordEnteredRejectsPasswordChange() {
        when(userRepository.findById(1L)).thenReturn(Optional.of(existingUser()));

        when(passwordService.verifyPassword("wrongOld", "stored-hash")).thenReturn(false);

        assertThatThrownBy(() -> userService.changePassword(1L, new ChangePasswordDTO("wrongOld", "AbCd1234")))
                .isInstanceOf(BadCredentialsException.class)
                .hasMessage("Invalid Password.");

        verify(userRepository, never()).save(any());
    }

    @Test
    void changingPasswordWithCorrectOldPasswordSavesTheNewHash() {
        when(userRepository.findById(1L)).thenReturn(Optional.of(existingUser()));
        when(passwordService.verifyPassword("oldPw", "stored-hash")).thenReturn(true);
        when(passwordService.hashPassword("AbCd1234")).thenReturn("new-hash");

        userService.changePassword(1L, new ChangePasswordDTO("oldPw", "AbCd1234"));

        ArgumentCaptor<Users> captor = ArgumentCaptor.forClass(Users.class);

        verify(userRepository).save(captor.capture());
        assertEquals("new-hash", captor.getValue().getPasswordHash());
    }

    @Test
    void deleteMissingUserIsRejected() {

        when(userRepository.findById(1L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> userService.deleteUser(1L, new DeleteUserDTO("password")))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessage("User not found, id : " + 1L);

        verify(userRepository, never()).delete(any());
    }

    @Test
    void wrongPasswordForDeleteUserRejected() {

        when(userRepository.findById(1L)).thenReturn(Optional.of(existingUser()));
        when(passwordService.verifyPassword("wrongPassword", "stored-hash")).thenReturn(false);

        assertThatThrownBy(() -> userService.deleteUser(1L, new DeleteUserDTO("wrongPassword")))
                .isInstanceOf(BadCredentialsException.class)
                .hasMessage("Invalid password");

        verify(userRepository, never()).delete(any());
    }

    @Test
    void deleteingWithCorrectPasswordRemovesTheUser() {
        Users user = existingUser();
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(passwordService.verifyPassword("rightPw", "stored-hash")).thenReturn(true);

        userService.deleteUser(1L, new DeleteUserDTO("rightPw"));

        verify(userRepository).delete(user);
    }
}
