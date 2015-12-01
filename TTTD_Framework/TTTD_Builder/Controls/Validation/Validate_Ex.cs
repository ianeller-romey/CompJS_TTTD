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
    public class Validate_Ex : IValidate
    {
        #region MEMBER FIELDS

        private object m_value;
        private Func<object, object, bool> m_function;

        #endregion


        #region MEMBER PROPERTIES
        #endregion


        #region MEMBER CLASSES
        #endregion


        #region MEMBER METHODS

        #region Public Functionality

        public Validate_Ex(object value, Func<object, object, bool> function)
        {
            m_value = value;
            m_function = function;
        }

        public bool Validate(object value)
        {
            return m_function(m_value, value);
        }

        #endregion


        #region Private Functionality
        #endregion

        #endregion
    }
}
