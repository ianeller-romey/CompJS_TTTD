using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using TTTD_Builder.Model.Data.Base;


namespace TTTD_Builder.Model.Data
{
    public class EntityInstanceDefinition : DataBase
    {
        #region MEMBER FIELDS

        private string m_gameState;

        #endregion


        #region MEMBER PROPERTIES

        public string GameState
        {
            get { return m_gameState; }
            set { if (value != m_gameState) { m_gameState = value; NotifyPropertyChanged("GameState"); } }
        }

        #endregion
    }
}
