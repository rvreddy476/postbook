using System.Text.RegularExpressions;

namespace PostBook.Auth.Domain.ValueObjects;

public record Email
{
    private static readonly Regex EmailRegex = new(
        @"^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$",
        RegexOptions.Compiled);

    public string Value { get; }
    public string Normalized { get; }

    private Email(string value)
    {
        Value = value;
        Normalized = value.ToLowerInvariant();
    }

    public static Email Create(string email)
    {
        if (string.IsNullOrWhiteSpace(email))
            throw new ArgumentException("Email cannot be empty", nameof(email));

        if (!EmailRegex.IsMatch(email))
            throw new ArgumentException("Invalid email format", nameof(email));

        return new Email(email);
    }

    public override string ToString() => Value;
}
