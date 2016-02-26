using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using TTTD_Builder.Model.Data.Base;


namespace TTTD_Builder.Model.Data
{
    public class LevelLayout : DataBase
    {
        #region MEMBER FIELDS

        private Level m_level;
        private EntityInstanceDefinition m_entityInstanceDefinition;
        private ObservableCollection<KeyValuePair<string, object>> m_data;
        private double m_x;
        private double m_y;

        #endregion


        #region MEMBER PROPERTIES

        public Level Level
        {
            get { return m_level; }
            set { if (value != m_level) { m_level = value; NotifyPropertyChanged("Level"); } }
        }

        public EntityInstanceDefinition EntityInstanceDefinition
        {
            get { return m_entityInstanceDefinition; }
            set { if (value != m_entityInstanceDefinition) { m_entityInstanceDefinition = value; NotifyPropertyChanged("EntityInstanceDefinition"); } }
        }

        public ObservableCollection<KeyValuePair<string, object>> Data
        {
            get { return m_data; }
            set { if (value != m_data) { m_data = value; NotifyPropertyChanged("Data"); } }
        }

        public double X
        {
            get { return m_x; }
            set { if (value != m_x) { m_x = value; NotifyPropertyChanged("X"); } }
        }

        public double Y
        {
            get { return m_y; }
            set { if (value != m_y) { m_y = value; NotifyPropertyChanged("Y"); } }
        }


        #endregion
    }
}
