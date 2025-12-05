using PostBook.Auth.Domain.Entities;
using PostBook.Auth.Domain.ValueObjects;

namespace PostBook.Auth.Domain.Interfaces;

public interface IUserRepository
{
    Task<User?> GetByIdAsync(Guid userId, CancellationToken cancellationToken = default);
    Task<User?> GetByEmailAsync(Email email, CancellationToken cancellationToken = default);
    Task<User?> GetByUsernameAsync(string username, CancellationToken cancellationToken = default);
    Task<User?> GetByEmailOrUsernameAsync(string identifier, CancellationToken cancellationToken = default);
    Task<bool> ExistsByEmailAsync(Email email, CancellationToken cancellationToken = default);
    Task<bool> ExistsByUsernameAsync(string username, CancellationToken cancellationToken = default);
    Task<User> AddAsync(User user, CancellationToken cancellationToken = default);
    Task UpdateAsync(User user, CancellationToken cancellationToken = default);
    Task DeleteAsync(User user, CancellationToken cancellationToken = default);
    Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
}
