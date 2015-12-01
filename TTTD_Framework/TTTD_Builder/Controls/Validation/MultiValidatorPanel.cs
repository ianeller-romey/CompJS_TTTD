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
    public class MultiValidatorPanel : ValidatorBase
    {
        #region MEMBER FIELDS

        public enum ValidationAggregationType
        {
            And,
            Or
        }

        #endregion


        #region MEMBER PROPERTIES
        #endregion


        #region MEMBER EVENTS
        #endregion


        #region MEMBER CLASSES

        private class AndValidationConverter : IMultiValueConverter
        {
            #region MEMBER FIELDS

            IValidate m_validate;

            #endregion


            #region MEMBER METHODS

            #region Public Functionality

            public AndValidationConverter(IValidate validate)
            {
                m_validate = validate;
            }

            public object Convert(object[] values, Type targetType, object parameter, System.Globalization.CultureInfo culture)
            {
                foreach(var o in values)
                    if (!m_validate.Validate(o))
                        return false;
                return true;
            }

            public object[] ConvertBack(object value, Type[] targetType, object parameter, System.Globalization.CultureInfo culture)
            {
                throw new NotImplementedException();
            }

            #endregion

            #endregion
        }

        private class OrValidationConverter : IMultiValueConverter
        {
            #region MEMBER FIELDS

            IValidate m_validate;

            #endregion


            #region MEMBER METHODS

            #region Public Functionality

            public OrValidationConverter(IValidate validate)
            {
                m_validate = validate;
            }

            public object Convert(object[] values, Type targetType, object parameter, System.Globalization.CultureInfo culture)
            {
                foreach (var o in values)
                    if (m_validate.Validate(o))
                        return true;
                return false;
            }

            public object[] ConvertBack(object value, Type[] targetType, object parameter, System.Globalization.CultureInfo culture)
            {
                throw new NotImplementedException();
            }

            #endregion

            #endregion
        }

        #endregion


        #region MEMBER METHODS

        #region Public Functionality

        public MultiValidatorPanel(UIElement content, UIElement[] elements, DependencyProperty[] properties, IValidate validation, ValidationAggregationType type)
        {
            Content = content;

            MultiBinding multiBinding = new MultiBinding();
            switch(type)
            {
                case ValidationAggregationType.And:
                    multiBinding.Converter = new AndValidationConverter(validation);
                    break;
                case ValidationAggregationType.Or:
                    multiBinding.Converter = new OrValidationConverter(validation);
                    break;
            }

            for (var i = 0; i < elements.Length; ++i)
            {
                Binding b = 
                    new Binding()
                    {
                        Source = elements[i],
                        Path = new PropertyPath(properties[i].Name),
                        Mode = BindingMode.OneWay
                    };
                multiBinding.Bindings.Add(b);
            }
            this.SetBinding(ValidProperty, multiBinding);
        }

        public MultiValidatorPanel(UIElement content, UIElement[] elements, DependencyProperty property, IValidate validation, ValidationAggregationType type)
        {
            Content = content;

            MultiBinding multiBinding = new MultiBinding();
            switch (type)
            {
                case ValidationAggregationType.And:
                    multiBinding.Converter = new AndValidationConverter(validation);
                    break;
                case ValidationAggregationType.Or:
                    multiBinding.Converter = new OrValidationConverter(validation);
                    break;
            }

            for (var i = 0; i < elements.Length; ++i)
            {
                Binding b =
                    new Binding()
                    {
                        Source = elements[i],
                        Path = new PropertyPath(property.Name),
                        Mode = BindingMode.OneWay
                    };
                multiBinding.Bindings.Add(b);
            }
            this.SetBinding(ValidProperty, multiBinding);
        }

        #endregion


        #region Private Functionality
        #endregion

        #endregion
    }
}
