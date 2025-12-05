using PostBook.Auth.Domain.Enums;
using PostBook.Auth.Domain.Exceptions;
using PostBook.Auth.Domain.ValueObjects;

namespace PostBook.Auth.Domain.Entities;

public class User
{
    public Guid UserId { get; private set; }
    public string Username { get; private set; }
    public Email Email { get; private set; }
    public string PasswordHash { get; private set; }
    public string FirstName { get; private set; }
    public string LastName { get; private set; }
    public PhoneNumber? PhoneNumber { get; private set; }
    public bool IsEmailVerified { get; private set; }
    public bool IsPhoneVerified { get; private set; }
    public DateTime? EmailVerifiedAt { get; private set; }
    public DateTime? PhoneVerifiedAt { get; private set; }
    public string? ProfilePictureUrl { get; private set; }
    public UserRole Role { get; private set; }
    public AccountStatus Status { get; private set; }
    public DateTime? LastLoginAt { get; private set; }
    public int FailedLoginAttempts { get; private set; }
    public DateTime? AccountLockedUntil { get; private set; }
    public DateTime? PasswordChangedAt { get; private set; }
    public bool IsDeleted { get; private set; }
    public DateTime? DeletedAt { get; private set; }
    public DateTime CreatedAt { get; private set; }
    public DateTime UpdatedAt { get; private set; }

    // Private constructor for EF Core
    private User() { }

    // Factory method
    public static User Create(
        string username,
        Email email,
        string passwordHash,
        string firstName,
        string lastName,
        PhoneNumber? phoneNumber = null)
    {
        if (string.IsNullOrWhiteSpace(username))
            throw new AuthException("Username cannot be empty");

        if (username.Length < 3)
            throw new AuthException("Username must be at least 3 characters");

        if (string.IsNullOrWhiteSpace(passwordHash))
            throw new AuthException("Password hash cannot be empty");

        if (passwordHash.Length != 60) // BCrypt hash length
            throw new AuthException("Invalid password hash format");

        return new User
        {
            UserId = Guid.NewGuid(),
            Username = username,
            Email = email,
            PasswordHash = passwordHash,
            FirstName = firstName,
            LastName = lastName,
            PhoneNumber = phoneNumber,
            IsEmailVerified = false,
            IsPhoneVerified = false,
            Role = UserRole.User,
            Status = AccountStatus.Active,
            FailedLoginAttempts = 0,
            IsDeleted = false,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };
    }

    // Business Logic Methods
    public void VerifyEmail()
    {
        if (IsEmailVerified)
            throw new AuthException("Email is already verified");

        IsEmailVerified = true;
        EmailVerifiedAt = DateTime.UtcNow;
        UpdatedAt = DateTime.UtcNow;
    }

    public void VerifyPhone()
    {
        if (PhoneNumber == null)
            throw new AuthException("No phone number to verify");

        if (IsPhoneVerified)
            throw new AuthException("Phone is already verified");

        IsPhoneVerified = true;
        PhoneVerifiedAt = DateTime.UtcNow;
        UpdatedAt = DateTime.UtcNow;
    }

    public void RecordSuccessfulLogin()
    {
        LastLoginAt = DateTime.UtcNow;
        FailedLoginAttempts = 0;
        AccountLockedUntil = null;
        UpdatedAt = DateTime.UtcNow;
    }

    public void RecordFailedLogin()
    {
        FailedLoginAttempts++;
        UpdatedAt = DateTime.UtcNow;

        // Lock account after 5 failed attempts for 15 minutes
        if (FailedLoginAttempts >= 5)
        {
            AccountLockedUntil = DateTime.UtcNow.AddMinutes(15);
        }
    }

    public bool IsAccountLocked()
    {
        if (AccountLockedUntil == null)
            return false;

        if (AccountLockedUntil > DateTime.UtcNow)
            return true;

        // Unlock automatically if lock period has passed
        AccountLockedUntil = null;
        FailedLoginAttempts = 0;
        return false;
    }

    public void UpdatePassword(string newPasswordHash)
    {
        if (string.IsNullOrWhiteSpace(newPasswordHash))
            throw new AuthException("Password hash cannot be empty");

        if (newPasswordHash.Length != 60)
            throw new AuthException("Invalid password hash format");

        PasswordHash = newPasswordHash;
        PasswordChangedAt = DateTime.UtcNow;
        UpdatedAt = DateTime.UtcNow;
    }

    public void UpdateProfile(string? firstName = null, string? lastName = null, 
        PhoneNumber? phoneNumber = null, string? profilePictureUrl = null)
    {
        if (!string.IsNullOrWhiteSpace(firstName))
            FirstName = firstName;

        if (!string.IsNullOrWhiteSpace(lastName))
            LastName = lastName;

        if (phoneNumber != null)
        {
            PhoneNumber = phoneNumber;
            IsPhoneVerified = false;
            PhoneVerifiedAt = null;
        }

        if (!string.IsNullOrWhiteSpace(profilePictureUrl))
            ProfilePictureUrl = profilePictureUrl;

        UpdatedAt = DateTime.UtcNow;
    }

    public void SoftDelete()
    {
        if (IsDeleted)
            throw new AuthException("User is already deleted");

        IsDeleted = true;
        DeletedAt = DateTime.UtcNow;
        Status = AccountStatus.Deleted;
        UpdatedAt = DateTime.UtcNow;
    }

    public void Restore()
    {
        if (!IsDeleted)
            throw new AuthException("User is not deleted");

        IsDeleted = false;
        DeletedAt = null;
        Status = AccountStatus.Active;
        UpdatedAt = DateTime.UtcNow;
    }

    public void Suspend()
    {
        Status = AccountStatus.Suspended;
        UpdatedAt = DateTime.UtcNow;
    }

    public void Activate()
    {
        Status = AccountStatus.Active;
        UpdatedAt = DateTime.UtcNow;
    }
}
