using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using TTTD_Builder.Model.Data.Base;


namespace TTTD_Builder.Model.Data
{
    public class PhysicsInstanceDefinition : DataBase
    {
        #region MEMBER FIELDS

        private EntityInstanceDefinition m_entityInstanceDefinition;
        private PhysType m_physType;
        private CollisionType m_collisionType;
        private string m_boundingData;

        #endregion


        #region MEMBER PROPERTIES

        public EntityInstanceDefinition EntityInstanceDefinition
        {
            get { return m_entityInstanceDefinition; }
            set { if (value != m_entityInstanceDefinition) { m_entityInstanceDefinition = value; NotifyPropertyChanged("EntityInstanceDefinition"); } }
        }

        public PhysType PhysType
        {
            get { return m_physType; }
            set { if (value != m_physType) { m_physType = value; NotifyPropertyChanged("PhysType"); } }
        }

        public CollisionType CollisionType
        {
            get { return m_collisionType; }
            set { if (value != m_collisionType) { m_collisionType = value; NotifyPropertyChanged("CollisionType"); } }
        }

        public string BoundingData
        {
            get { return m_boundingData; }
            set { if (value != m_boundingData) { m_boundingData = value; NotifyPropertyChanged("BoundingData"); } }
        }


        #endregion
    }
}
