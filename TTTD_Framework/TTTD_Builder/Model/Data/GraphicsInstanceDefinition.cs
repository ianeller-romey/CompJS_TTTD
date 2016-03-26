using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using TTTD_Builder.Model.Data.Base;


namespace TTTD_Builder.Model.Data
{
    public class GraphicsInstanceDefinition : DataBase
    {
        #region MEMBER FIELDS

        private EntityInstanceDefinition m_entityInstanceDefinition;
        private int m_renderPass;

        #endregion


        #region MEMBER PROPERTIES

        public EntityInstanceDefinition EntityInstanceDefinition
        {
            get { return m_entityInstanceDefinition; }
            set { if (value != m_entityInstanceDefinition) { m_entityInstanceDefinition = value; NotifyPropertyChanged("EntityInstanceDefinition"); } }
        }

        public int RenderPass
        {
            get { return m_renderPass; }
            set { if (value != m_renderPass) { m_renderPass = value; NotifyPropertyChanged("RenderPass"); } }
        }

        #endregion

    }
}
