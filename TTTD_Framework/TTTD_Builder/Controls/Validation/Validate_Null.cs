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
    public class Validate_Null : IValidate
    {
        #region MEMBER FIELDS
        #endregion


        #region MEMBER PROPERTIES
        #endregion


        #region MEMBER METHODS

        #region Public Functionality

        public Validate_Null()
        {
        }

        public bool Validate(object value)
        {
            return value == null;
        }

        #endregion


        #region Private Functionality
        #endregion

        #endregion
    }
}
