using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using TTTD_Builder.Managers;
using TTTD_Builder.Model.Extensions.Base;
using TTTD_Builder.Model.Data;


namespace TTTD_Builder.Model.Extensions
{
    public class GraphicsInstanceDefinition_Ex : ExtensionsBase
    {
        #region MEMBER FIELDS

        public enum GraphicsInstanceDefinitionType
        {
            Undetermined,
            Animation,
            Font
        }

        private GraphicsInstanceDefinition m_graphicsInstanceDefinition;
        private GraphicsInstanceDefinitionType m_graphicsInstanceDefinitionType;

        #endregion


        #region MEMBER PROPERTIES

        public GraphicsInstanceDefinition GraphicsInstanceDefinition
        {
            get { return m_graphicsInstanceDefinition; }
            set 
            { 
                if (value != m_graphicsInstanceDefinition) 
                { 
                    m_graphicsInstanceDefinition = value; 
                    NotifyPropertyChanged("GraphicsInstanceDefinition");

                    if (DataManager.AnimationStateDefinitions.Any(x => x.GraphicsInstanceDefinition == m_graphicsInstanceDefinition))
                        Type = GraphicsInstanceDefinition_Ex.GraphicsInstanceDefinitionType.Animation;
                    else if (DataManager.FontTextureDefinitions.Any(x => x.GraphicsInstanceDefinition == m_graphicsInstanceDefinition))
                        Type = GraphicsInstanceDefinition_Ex.GraphicsInstanceDefinitionType.Font;
                    else
                        Type = GraphicsInstanceDefinition_Ex.GraphicsInstanceDefinitionType.Undetermined;

                } 
            }
        }

        public GraphicsInstanceDefinitionType Type
        {
            get { return m_graphicsInstanceDefinitionType; }
            private set { if (value != m_graphicsInstanceDefinitionType) { m_graphicsInstanceDefinitionType = value; NotifyPropertyChanged("GraphicsInstanceDefinitionType"); } }
        }

        #endregion
    }
}
