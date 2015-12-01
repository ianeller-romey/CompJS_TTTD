using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Windows.Input;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Media;


namespace TTTD_Builder.Controls.Validation
{
    public class Validate_NotEqualTo : IValidate
    {
        #region MEMBER FIELDS

        private object m_value;

        #endregion


        #region MEMBER PROPERTIES
        #endregion


        #region MEMBER METHODS

        #region Public Functionality

        public Validate_NotEqualTo(object value)
        {
            m_value = value;
        }

        public bool Validate(object value)
        {
            return m_value != value;
        }

        #endregion


        #region Private Functionality
        #endregion

        #endregion
    }
}
