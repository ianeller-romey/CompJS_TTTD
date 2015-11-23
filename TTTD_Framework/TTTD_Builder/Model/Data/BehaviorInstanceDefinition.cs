using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using TTTD_Builder.Model.Base;


namespace TTTD_Builder.Model.Data
{
    public class BehaviorInstanceDefinition : DataBase
    {
        #region MEMBER FIELDS

        private EntityInstanceDefinition m_entityInstanceDefinition;
        private string m_behaviorFile;
        private string m_behaviorConstructor;

        #endregion


        #region MEMBER PROPERTIES

        public EntityInstanceDefinition EntityInstanceDefinition
        {
            get { return m_entityInstanceDefinition; }
            set { if (value != m_entityInstanceDefinition) { m_entityInstanceDefinition = value; NotifyPropertyChanged("EntityInstanceDefinition"); } }
        }

        public string BehaviorFile
        {
            get { return m_behaviorFile; }
            set { if (value != m_behaviorFile) { m_behaviorFile = value; NotifyPropertyChanged("BehaviorFile"); } }
        }

        public string BehaviorConstructor
        {
            get { return m_behaviorConstructor; }
            set { if (value != m_behaviorConstructor) { m_behaviorConstructor = value; NotifyPropertyChanged("BehaviorConstructor"); } }
        }

        #endregion

    }
}
