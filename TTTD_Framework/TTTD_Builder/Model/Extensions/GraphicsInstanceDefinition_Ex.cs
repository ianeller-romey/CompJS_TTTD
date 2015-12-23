using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using TTTD_Builder.Managers;
using TTTD_Builder.Model.Extensions.Base;
using TTTD_Builder.Model.Data;
using TTTD_Builder.Model.Interfaces;


namespace TTTD_Builder.Model.Extensions
{
    public abstract class GraphicsInstanceDefinition_Ex : ExtensionsBase, IHasName
    {
        #region MEMBER FIELDS

        public enum GraphicsInstanceDefinitionType
        {
            Undetermined,
            Animation,
            Font
        }

        protected GraphicsInstanceDefinition m_graphicsInstanceDefinition;
        protected GraphicsInstanceDefinitionType m_typeOfInstance;

        #endregion


        #region MEMBER PROPERTIES

        public GraphicsInstanceDefinition GraphicsInstanceDefinition
        {
            get { return m_graphicsInstanceDefinition; }
            set  { if (value != m_graphicsInstanceDefinition) { m_graphicsInstanceDefinition = value; NotifyPropertyChanged("GraphicsInstanceDefinition"); } }
        }

        public GraphicsInstanceDefinitionType TypeOfInstance
        {
            get { return m_typeOfInstance; }
            private set { if (value != m_typeOfInstance) { m_typeOfInstance = value; NotifyPropertyChanged("TypeOfInstance"); } }
        }

        public int Id
        {
            get { return m_graphicsInstanceDefinition.Id; }
        }

        public string Name
        {
            get { return m_graphicsInstanceDefinition.Name; }
        }

        #endregion


        #region MEMBER METHODS

        #region Public Functionality

        public GraphicsInstanceDefinition_Ex(GraphicsInstanceDefinition graphicsInstanceDefinition, GraphicsInstanceDefinitionType typeOfInstance)
        {
            m_graphicsInstanceDefinition = graphicsInstanceDefinition;
            m_typeOfInstance = typeOfInstance;
        }

        public abstract void Refresh();

        #endregion

        #endregion
    }
}
