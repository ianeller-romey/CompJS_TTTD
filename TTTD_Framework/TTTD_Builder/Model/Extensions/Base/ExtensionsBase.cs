using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using TTTD_Builder.Model.Interfaces;


namespace TTTD_Builder.Model.Extensions.Base
{
    public abstract class ExtensionsBase : INotifyPropertyChanged
    {
        #region MEMBER FIELDS
        #endregion


        #region MEMBER PROPERTIES
        #endregion


        #region MEMBER EVENTS

        public event PropertyChangedEventHandler PropertyChanged;

        #endregion


        #region MEMBER METHODS

        #region Public Functionality
        #endregion


        #region Protected Functionality

        protected void NotifyPropertyChanged(string name)
        {
            if(PropertyChanged != null && !string.IsNullOrEmpty(name))
                PropertyChanged(this, new PropertyChangedEventArgs(name));
        }

        #endregion

        #endregion
    }
}
