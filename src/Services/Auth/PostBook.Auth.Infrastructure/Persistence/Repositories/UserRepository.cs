using Microsoft.EntityFrameworkCore;
using PostBook.Auth.Domain.Entities;
using PostBook.Auth.Domain.Interfaces;
using PostBook.Auth.Domain.ValueObjects;

namespace PostBook.Auth.Infrastructure.Persistence.Repositories;

public class UserRepository : IUserRepository
{
    private readonly ApplicationDbContext _context;

    public UserRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<User?> GetByIdAsync(Guid userId, CancellationToken cancellationToken = default)
    {
        return await _context.Users
            .FirstOrDefaultAsync(u => u.UserId == userId && !u.IsDeleted, cancellationToken);
    }

    public async Task<User?> GetByEmailAsync(Email email, CancellationToken cancellationToken = default)
    {
        return await _context.Users
            .FirstOrDefaultAsync(u => u.Email.Normalized == email.Normalized && !u.IsDeleted, cancellationToken);
    }

    public async Task<User?> GetByUsernameAsync(string username, CancellationToken cancellationToken = default)
    {
        return await _context.Users
            .FirstOrDefaultAsync(u => u.Username.ToLower() == username.ToLower() && !u.IsDeleted, cancellationToken);
    }

    public async Task<User?> GetByEmailOrUsernameAsync(string identifier, CancellationToken cancellationToken = default)
    {
        var normalizedIdentifier = identifier.ToLowerInvariant();
        
        return await _context.Users
            .FirstOrDefaultAsync(u => 
                (u.Email.Normalized == normalizedIdentifier || u.Username.ToLower() == normalizedIdentifier) 
                && !u.IsDeleted, 
                cancellationToken);
    }

    public async Task<bool> ExistsByEmailAsync(Email email, CancellationToken cancellationToken = default)
    {
        return await _context.Users
            .AnyAsync(u => u.Email.Normalized == email.Normalized && !u.IsDeleted, cancellationToken);
    }

    public async Task<bool> ExistsByUsernameAsync(string username, CancellationToken cancellationToken = default)
    {
        return await _context.Users
            .AnyAsync(u => u.Username.ToLower() == username.ToLower() && !u.IsDeleted, cancellationToken);
    }

    public async Task<User> AddAsync(User user, CancellationToken cancellationToken = default)
    {
        await _context.Users.AddAsync(user, cancellationToken);
        return user;
    }

    public Task UpdateAsync(User user, CancellationToken cancellationToken = default)
    {
        _context.Users.Update(user);
        return Task.CompletedTask;
    }

    public Task DeleteAsync(User user, CancellationToken cancellationToken = default)
    {
        _context.Users.Remove(user);
        return Task.CompletedTask;
    }

    public async Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        return await _context.SaveChangesAsync(cancellationToken);
    }
}
