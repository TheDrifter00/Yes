using System.Security.Cryptography;

namespace GoNorth.Services.Encryption
{
    /// <summary>
    /// Random Secure Token Generator
    /// </summary>
    public class RngSecureTokenGenerator : ISecureTokenGenerator
    {
        /// <summary>
        /// Token Characters
        /// </summary>
        private const string TokenChars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890-_";

        /// <summary>
        /// Generates a secure token
        /// </summary>
        /// <param name="length">Length of the token to generate</param>
        /// <returns>Generated token</returns>
        public string GenerateSecureToken(int length)
        {
            int maxRandom = byte.MaxValue - ((byte.MaxValue + 1) % TokenChars.Length);

            byte[] data = RandomNumberGenerator.GetBytes(length);

            char[] result = new char[length];
            for (int curChar = 0; curChar < length; ++curChar)
            {
                byte value = data[curChar];
                while (value > maxRandom)
                {
                    byte[] buffer = RandomNumberGenerator.GetBytes(1);
                    value = buffer[0];
                }

                result[curChar] = TokenChars[value % TokenChars.Length];
            }

            return new string(result);
        }
    }
}
