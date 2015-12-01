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
    public abstract class ValidatorBase : ContentControl, IValidator, INotifyPropertyChanged
    {
        #region MEMBER FIELDS

        private bool m_valid = false;

        #endregion


        #region MEMBER PROPERTIES

        public static readonly DependencyProperty ValidProperty = DependencyProperty.Register(
            "Valid",
            typeof(bool),
            typeof(ValidatorBase),
            new FrameworkPropertyMetadata(false, 
                FrameworkPropertyMetadataOptions.AffectsRender,
                new PropertyChangedCallback(OnValidChanged))
        );

        public bool Valid
        {
            get { return (bool)GetValue(ValidProperty); }
            set { SetValue(ValidProperty, value); }
        }

        #endregion


        #region MEMBER EVENTS

        public event PropertyChangedEventHandler PropertyChanged;

        #endregion


        #region MEMBER METHODS

        #region Public Functionality

        public ValidatorBase()
        {
        }

        #endregion


        #region Private Functionality

        private static void OnValidChanged(DependencyObject d, DependencyPropertyChangedEventArgs e)
        {
            var dd = d as ValidatorBase;
            if(dd != null && e.Property == ValidProperty)
            {
                dd.NotifyPropertyChanged("Valid");
            }
        }

        #endregion


        #region Protected Functionality

        protected void NotifyPropertyChanged(string name)
        {
            if (PropertyChanged != null && !string.IsNullOrEmpty(name))
                PropertyChanged(this, new PropertyChangedEventArgs(name));
        }

        #endregion

        #endregion
    }
}
