using System.Collections.Generic;
using GoNorth.Services.Export.Placeholder.ScribanRenderingEngine.Util;

namespace GoNorth.Services.Export.Placeholder.ScribanRenderingEngine.RenderingObjects
{
    /// <summary>
    /// Class to export language key object data to Scriban
    /// </summary>
    public class ScribanExportLanguageObject
    {
        /// <summary>
        /// Flex field object to which the language file belongs
        /// </summary>
        [ScribanExportValueObjectLabel]
        public ScribanFlexFieldObject Object { get; set; }

        /// <summary>
        /// Language keys
        /// </summary>
        [ScribanExportValueLabel]
        public List<ScribanExportLanguageKey> LanguageKeys { get; set; }

        /// <summary>
        /// Constructor
        /// </summary>
        public ScribanExportLanguageObject()
        {
            LanguageKeys = new List<ScribanExportLanguageKey>();
        }
    }
}