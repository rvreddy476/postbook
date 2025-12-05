using System.Text.RegularExpressions;

namespace PostBook.Auth.Domain.ValueObjects;

public record PhoneNumber
{
    private static readonly Regex PhoneRegex = new(
        @"^\+?[1-9]\d{1,14}$",
        RegexOptions.Compiled);

    public string Value { get; }

    private PhoneNumber(string value)
    {
        Value = value;
    }

    public static PhoneNumber? Create(string? phoneNumber)
    {
        if (string.IsNullOrWhiteSpace(phoneNumber))
            return null;

        // Remove common formatting characters
        var cleaned = Regex.Replace(phoneNumber, @"[\s\-\(\)]", "");

        if (!PhoneRegex.IsMatch(cleaned))
            throw new ArgumentException("Invalid phone number format", nameof(phoneNumber));

        return new PhoneNumber(cleaned);
    }

    public override string ToString() => Value;
}
