using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using TTTD_Builder.Model.Data.Base;


namespace TTTD_Builder.Model.Data
{
    public class Level : DataBase
    {
        #region MEMBER FIELDS

        private int? m_order;
        private double m_width;
        private double m_height;

        #endregion


        #region MEMBER PROPERTIES

        public int? Order
        {
            get { return m_order; }
            set { if (value != m_order) { m_order = value; NotifyPropertyChanged("Order"); } }
        }

        public double Width
        {
            get { return m_width; }
            set { if (value != m_width) { m_width = value; NotifyPropertyChanged("Width"); } }
        }

        public double Height
        {
            get { return m_height; }
            set { if (value != m_height) { m_height = value; NotifyPropertyChanged("Height"); } }
        }


        #endregion
    }
}
