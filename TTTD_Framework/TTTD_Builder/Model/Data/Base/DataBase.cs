using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using TTTD_Builder.Model.Interfaces;


namespace TTTD_Builder.Model.Base
{
    public abstract class DataBase : IHasId, IHasName, INotifyPropertyChanged
    {
        #region MEMBER FIELDS

        protected int m_id;
        protected string m_name;

        #endregion


        #region MEMBER PROPERTIES

        public int Id 
        {
            get { return m_id; }
            set { if (value != m_id) { m_id = value; NotifyPropertyChanged("Id"); } }
        }

        public string Name
        {
            get { return m_name; }
            set { if (value != m_name) { m_name = value; NotifyPropertyChanged("Name"); } }
        }

        #endregion


        #region MEMBER EVENTS

        public event PropertyChangedEventHandler PropertyChanged;

        #endregion


        #region MEMBER METHODS

        #region Public Functionality

        public override string ToString()
        {
            return NameAnd();
        }

        #endregion


        #region Protected Functionality

        protected virtual string NameAnd()
        {
            return string.Format("{0}: {1}", Id, Name);
        }

        protected void NotifyPropertyChanged(string name)
        {
            if(PropertyChanged != null && !string.IsNullOrEmpty(name))
                PropertyChanged(this, new PropertyChangedEventArgs(name));
        }

        #endregion

        #endregion
    }
}
