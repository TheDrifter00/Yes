using System.Collections.Generic;
using System.Threading.Tasks;
using GoNorth.Data.Exporting;
using GoNorth.Data.FlexFieldDatabase;
using GoNorth.Data.Project;
using GoNorth.Services.Export.Data;
using GoNorth.Services.Export.Dialog.ActionRendering.ConfigObject;
using GoNorth.Services.Export.Dialog.ActionRendering.ScribanRenderingEngine.RenderingObjects;
using GoNorth.Services.Export.Dialog.ActionRendering.ScribanRenderingEngine.Util;
using GoNorth.Services.Export.Dialog.StepRenderers.ActionRenderer;
using GoNorth.Services.Export.Placeholder;
using GoNorth.Services.Export.Placeholder.ScribanRenderingEngine.Util;
using Microsoft.Extensions.Localization;

namespace GoNorth.Services.Export.Dialog.ActionRendering.ScribanRenderingEngine
{
    /// <summary>
    /// Class for rendering a persist dialog state action renderer
    /// </summary>
    public class ScribanPersistDialogStateActionRenderer : BaseActionRenderer<PersistDialogStateActionData>
    {
        
        /// <summary>
        /// Cached database access
        /// </summary>
        private readonly IExportCachedDbAccess _cachedDbAccess;

        /// <summary>
        /// String Localizer Factory
        /// </summary>
        private readonly IStringLocalizerFactory _localizerFactory;

        /// <summary>
        /// Constructor
        /// </summary>
        /// <param name="cachedDbAccess">Cached db access</param>
        /// <param name="localizerFactory">Localizer Factory</param>
        public ScribanPersistDialogStateActionRenderer(IExportCachedDbAccess cachedDbAccess, IStringLocalizerFactory localizerFactory)
        {
            _cachedDbAccess = cachedDbAccess;
            _localizerFactory = localizerFactory;
        }

        /// <summary>
        /// Builds an action from parsed data
        /// </summary>
        /// <param name="template">Template to export</param>
        /// <param name="parsedData">Parsed data</param>
        /// <param name="data">Dialog data</param>
        /// <param name="nextStep">Next step in the dialog</param>
        /// <param name="project">Project</param>
        /// <param name="errorCollection">Error Collection</param>
        /// <param name="flexFieldObject">Flex field object to which the dialog belongs</param>
        /// <param name="exportSettings">Export Settings</param>
        /// <param name="stepRenderer">Action Step renderer</param>
        /// <returns>Action string</returns>
        public override async Task<string> BuildActionFromParsedData(ExportTemplate template, PersistDialogStateActionData parsedData, ExportDialogData data, ExportDialogData nextStep, GoNorthProject project, ExportPlaceholderErrorCollection errorCollection, 
                                                                     FlexFieldObject flexFieldObject, ExportSettings exportSettings, IActionStepRenderer stepRenderer)
        {
            ScribanPersistDialogStateData persistDialogData = new ScribanPersistDialogStateData();
            persistDialogData.EndDialog = parsedData != null && parsedData.EndDialog.HasValue ? parsedData.EndDialog.Value : false;

            return await ScribanActionRenderingUtil.FillPlaceholders(_cachedDbAccess, errorCollection, template.Code, parsedData, flexFieldObject, data, nextStep, null, stepRenderer);
        }

        /// <summary>
        /// Builds a preview text from parsed data
        /// </summary>
        /// <param name="parsedData">Parsed data</param>
        /// <param name="flexFieldObject">Flex Field object to which the dialog belongs</param>
        /// <param name="errorCollection">Error Collection</param>
        /// <param name="child">Child node</param>
        /// <param name="parent">Parent</param>
        /// <returns>Preview text</returns>
        public override Task<string> BuildPreviewTextFromParsedData(PersistDialogStateActionData parsedData, FlexFieldObject flexFieldObject, ExportPlaceholderErrorCollection errorCollection, ExportDialogData child, ExportDialogData parent)
        {
            return Task.FromResult("Persist Dialog State");
        }

        /// <summary>
        /// Returns the Export Template Placeholders for a Template Type
        /// </summary>
        /// <param name="templateType">Template Type</param>
        /// <returns>Export Template Placeholder</returns>
        public override List<ExportTemplatePlaceholder> GetExportTemplatePlaceholdersForType(TemplateType templateType)
        {
            return ScribanPlaceholderGenerator.GetPlaceholdersForObject<ScribanPersistDialogStateData>(_localizerFactory, ExportConstants.ScribanActionObjectKey);
        }
    }
}