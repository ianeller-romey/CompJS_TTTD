using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Windows.Input;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Data;
using System.Windows.Media;


namespace TTTD_Builder.Controls.Validation
{
    public class ValidatorPanel : ValidatorBase
    {
        #region MEMBER FIELDS
        #endregion


        #region MEMBER PROPERTIES
        #endregion


        #region MEMBER EVENTS
        #endregion


        #region MEMBER CLASSES

        private class ValidationConverter : IValueConverter
        {
            #region MEMBER FIELDS

            IValidate m_validate;

            #endregion


            #region MEMBER METHODS

            #region Public Functionality

            public ValidationConverter(IValidate validate)
            {
                m_validate = validate;
            }

            public object Convert(object value, Type targetType, object parameter, System.Globalization.CultureInfo culture)
            {
                return m_validate.Validate(value);
            }

            public object ConvertBack(object value, Type targetType, object parameter, System.Globalization.CultureInfo culture)
            {
                throw new NotImplementedException();
            }

            #endregion

            #endregion
        }

        #endregion


        #region MEMBER METHODS

        #region Public Functionality

        public ValidatorPanel(UIElement element, DependencyProperty property, IValidate validation)
        {
            Content = element;

            Binding binding =
                new Binding()
                {
                    Source = element,
                    Path = new PropertyPath(property.Name),
                    Mode = BindingMode.OneWay,
                    Converter = new ValidationConverter(validation)
                };
            base.SetBinding(ValidProperty, binding);
        }

        #endregion


        #region Private Functionality
        #endregion

        #endregion
    }
}
