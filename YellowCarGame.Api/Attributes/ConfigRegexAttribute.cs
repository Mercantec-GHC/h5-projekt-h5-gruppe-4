using System.ComponentModel.DataAnnotations;
using System.Text.RegularExpressions;

namespace YellowCarGame.Api.Attributes
{
    public class ConfigRegexAttribute : ValidationAttribute
    {
        private readonly string _configKey;

        public ConfigRegexAttribute(string configKey)
        {
            _configKey = configKey;
        }

        protected override ValidationResult IsValid(object value, ValidationContext validationContext)
        {
            var config = (IConfiguration)validationContext.GetService(typeof(IConfiguration));

            if (config == null)
                return new ValidationResult("Configuration service not available.");

            var pattern = config[_configKey];

            if (string.IsNullOrWhiteSpace(pattern))
                return new ValidationResult($"Regex pattern not found in configuration key '{_configKey}'.");

            if (value is not string str)
                return ValidationResult.Success;

            if (Regex.IsMatch(str, pattern))
                return ValidationResult.Success;

            return new ValidationResult(ErrorMessage ?? "Invalid format.");
        }
    }
}
