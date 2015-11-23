using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using TTTD_Builder.Model.Base;


namespace TTTD_Builder.Model.Data
{
    public class Level : DataBase
    {
        #region MEMBER FIELDS

        private int m_order;

        #endregion


        #region MEMBER PROPERTIES

        public int Order
        {
            get { return m_order; }
            set { if (value != m_order) { m_order = value; NotifyPropertyChanged("Order"); } }
        }


        #endregion
    }
}
