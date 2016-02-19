using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;

using TTTD_Builder.Managers;
using TTTD_Builder.Model.Extensions.Base;
using TTTD_Builder.Model.Data;
using TTTD_Builder.Model.Interfaces;


namespace TTTD_Builder.Model.Extensions
{
    public abstract class PhysicsInstanceDefinition_Ex : ExtensionsBase, IHasName
    {
        #region MEMBER FIELDS

        public enum PhysicsInstanceDefinitionType
        {
            Undetermined,
            AABB,
            Circle
        }

        protected PhysicsInstanceDefinition m_physicsInstanceDefinition;
        protected PhysicsInstanceDefinitionType m_typeOfInstance;

        #endregion


        #region MEMBER PROPERTIES

        public PhysicsInstanceDefinition PhysicsInstanceDefinition
        {
            get { return m_physicsInstanceDefinition; }
            set { if (value != m_physicsInstanceDefinition) { m_physicsInstanceDefinition = value; SetBoundingData(CalculateBoundingObject()); NotifyPropertyChanged("PhysicsInstanceDefinition"); } }
        }

        public PhysicsInstanceDefinitionType TypeOfInstance
        {
            get { return m_typeOfInstance; }
            private set { if (value != m_typeOfInstance) { m_typeOfInstance = value; NotifyPropertyChanged("TypeOfInstance"); } }
        }

        public int Id
        {
            get { return m_physicsInstanceDefinition.Id; }
        }

        public string Name
        {
            get { return m_physicsInstanceDefinition.Name; }
        }

        #endregion


        #region MEMBER METHODS

        #region Public Functionality

        public PhysicsInstanceDefinition_Ex(PhysicsInstanceDefinition physicsInstanceDefinition, PhysicsInstanceDefinitionType typeOfInstance)
        {
            m_physicsInstanceDefinition = physicsInstanceDefinition;
            TypeOfInstance = typeOfInstance;

            if (m_physicsInstanceDefinition != null && !string.IsNullOrWhiteSpace(m_physicsInstanceDefinition.BoundingData))
                ParseBoundingData(m_physicsInstanceDefinition.BoundingData);
        }

        #endregion


        #region Protected Functionality

        protected abstract void ParseBoundingData(string boundingData);

        protected abstract object CalculateBoundingObject();

        protected void SetBoundingData(object boundingObject)
        {
            if(m_physicsInstanceDefinition != null)
                m_physicsInstanceDefinition.BoundingData = 
                    JsonConvert.SerializeObject(boundingObject, new JsonSerializerSettings() { ContractResolver = new CamelCasePropertyNamesContractResolver() });
        }

        #endregion

        #endregion
    }
}
