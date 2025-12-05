using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using PostBook.Auth.Domain.Entities;
using PostBook.Auth.Domain.Enums;

namespace PostBook.Auth.Infrastructure.Persistence.Configurations;

public class UserConfiguration : IEntityTypeConfiguration<User>
{
    public void Configure(EntityTypeBuilder<User> builder)
    {
        builder.ToTable("users");

        builder.HasKey(u => u.UserId);

        builder.Property(u => u.UserId)
            .HasColumnName("user_id")
            .IsRequired();

        builder.Property(u => u.Username)
            .HasColumnName("username")
            .HasMaxLength(50)
            .IsRequired();

        builder.Property(u => u.PasswordHash)
            .HasColumnName("password_hash")
            .HasMaxLength(255)
            .IsRequired();

        builder.Property(u => u.FirstName)
            .HasColumnName("first_name")
            .HasMaxLength(100)
            .IsRequired();

        builder.Property(u => u.LastName)
            .HasColumnName("last_name")
            .HasMaxLength(100)
            .IsRequired();

        builder.Property(u => u.ProfilePictureUrl)
            .HasColumnName("profile_picture_url");

        builder.Property(u => u.IsEmailVerified)
            .HasColumnName("is_email_verified")
            .IsRequired();

        builder.Property(u => u.IsPhoneVerified)
            .HasColumnName("is_phone_verified")
            .IsRequired();

        builder.Property(u => u.EmailVerifiedAt)
            .HasColumnName("email_verified_at");

        builder.Property(u => u.PhoneVerifiedAt)
            .HasColumnName("phone_verified_at");

        builder.Property(u => u.Role)
            .HasColumnName("role")
            .HasConversion(
                v => v.ToString(),
                v => (UserRole)Enum.Parse(typeof(UserRole), v))
            .HasMaxLength(20)
            .IsRequired();

        builder.Property(u => u.Status)
            .HasColumnName("account_status")
            .HasConversion(
                v => v.ToString(),
                v => (AccountStatus)Enum.Parse(typeof(AccountStatus), v))
            .HasMaxLength(20)
            .IsRequired();

        builder.Property(u => u.LastLoginAt)
            .HasColumnName("last_login_at");

        builder.Property(u => u.FailedLoginAttempts)
            .HasColumnName("failed_login_attempts")
            .IsRequired();

        builder.Property(u => u.AccountLockedUntil)
            .HasColumnName("account_locked_until");

        builder.Property(u => u.PasswordChangedAt)
            .HasColumnName("password_changed_at");

        builder.Property(u => u.IsDeleted)
            .HasColumnName("is_deleted")
            .IsRequired();

        builder.Property(u => u.DeletedAt)
            .HasColumnName("deleted_at");

        builder.Property(u => u.CreatedAt)
            .HasColumnName("created_at")
            .IsRequired();

        builder.Property(u => u.UpdatedAt)
            .HasColumnName("updated_at")
            .IsRequired();

        // Configure Email value object as owned entity
        builder.OwnsOne(u => u.Email, email =>
        {
            email.Property(e => e.Value)
                .HasColumnName("email")
                .HasMaxLength(255)
                .IsRequired();

            email.Property(e => e.Normalized)
                .HasColumnName("email_normalized")
                .HasMaxLength(255)
                .IsRequired();

            email.HasIndex(e => e.Normalized)
                .HasDatabaseName("ix_users_email_normalized");
        });

        // Configure PhoneNumber value object as owned entity
        builder.OwnsOne(u => u.PhoneNumber, phone =>
        {
            phone.Property(p => p.Value)
                .HasColumnName("phone_number")
                .HasMaxLength(20);
        });

        // Indexes
        builder.HasIndex(u => u.Username)
            .IsUnique()
            .HasDatabaseName("ix_users_username");

        builder.HasIndex(u => new { u.IsDeleted, u.Status })
            .HasDatabaseName("ix_users_deleted_status");

        builder.HasIndex(u => u.CreatedAt)
            .HasDatabaseName("ix_users_created_at");

        builder.HasIndex(u => u.LastLoginAt)
            .HasDatabaseName("ix_users_last_login_at");
    }
}
