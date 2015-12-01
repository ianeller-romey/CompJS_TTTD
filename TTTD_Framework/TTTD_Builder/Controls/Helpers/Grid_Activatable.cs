using System;
using System.Collections.Generic;
using System.Windows.Input;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Data;
using System.Windows.Media;

using TTTD_Builder.Controls.Validation;
using TTTD_Builder.Lib.Data;


namespace TTTD_Builder.Controls.Helpers
{
    public class Grid_Activatable : Grid
    {
        #region MEMBER FIELDS

        private MouseButtonEventHandler m_mouseButtonEventHandler;

        private Grid m_gridButtons;
        private GroupBox m_groupBox;

        #endregion


        #region MEMBER PROPERTIES
        #endregion


        #region MEMBER EVENTS

        public delegate void ChangesAcceptedHandler();
        public event ChangesAcceptedHandler ChangesAccepted;

        public delegate void ChangesCancelledHandler();
        public event ChangesCancelledHandler ChangesCancelled;

        #endregion


        #region MEMBER METHODS

        #region Public Functionality

        public Grid_Activatable(string title, UIElement content, bool enabled)
        {
            m_mouseButtonEventHandler = new MouseButtonEventHandler(GroupBox_Activatable_LostFocus);

            CreateControls(title, content, null, enabled);

            MouseDown += GroupBox_Activatable_MouseDown;
        }

        public Grid_Activatable(string title, UIElement content, IEnumerable<ValidatorBase> validators, bool enabled)
        {
            m_mouseButtonEventHandler = new MouseButtonEventHandler(GroupBox_Activatable_LostFocus);

            CreateControls(title, content, validators, enabled);

            MouseDown += GroupBox_Activatable_MouseDown;
        }

        #endregion


        #region Private Functionality

        private void CreateControls(string title, UIElement content, IEnumerable<ValidatorBase> validators, bool enabled)
        {
            Background = Brushes.Transparent;
            RowDefinitions.Add(new RowDefinition() { Height = new GridLength(100.0, GridUnitType.Star) });
            RowDefinitions.Add(new RowDefinition() { Height = GridLength.Auto });

            m_gridButtons = new Grid();
            m_gridButtons.IsEnabled = enabled;
            m_gridButtons.ColumnDefinitions.Add(new ColumnDefinition() { Width = new GridLength(50.0, GridUnitType.Star) });
            m_gridButtons.ColumnDefinitions.Add(new ColumnDefinition() { Width = new GridLength(50.0, GridUnitType.Star) });
            this.SetGridRowColumn(m_gridButtons, 1, 0);

            Button button_accept = new Button() { Content = "Accept" };
            button_accept.Click += (sender, args) => { RaiseChangesAccepted(); Disable(); };
            m_gridButtons.SetGridRowColumn(button_accept, 0, 0);

            if (validators != null)
            {
                MultiBinding multiBinding = new MultiBinding() { Converter = new AllValidationsConverter() };
                foreach (var v in validators)
                {
                    Binding binding = new Binding("Valid") { Source = v, Mode = BindingMode.OneWay };
                    multiBinding.Bindings.Add(binding);
                }
                button_accept.SetBinding(UIElement.IsEnabledProperty, multiBinding);
            }

            Button button_cancel = new Button() { Content = "Cancel" };
            button_cancel.Click += (sender, args) => { RaiseChangesCancelled(); Disable(); };
            m_gridButtons.SetGridRowColumn(button_cancel, 0, 1);

            m_groupBox =
                new GroupBox()
                {
                    Header = title,
                    Content = content,
                    IsEnabled = enabled,
                };
            this.SetGridRowColumn(m_groupBox, 0, 0);
        }

        private void Enable()
        {
            m_groupBox.IsEnabled = true;
            m_gridButtons.IsEnabled = true;
            Mouse.Capture(m_groupBox, CaptureMode.SubTree);
            m_groupBox.AddHandler(Mouse.PreviewMouseDownOutsideCapturedElementEvent, m_mouseButtonEventHandler, true);
        }

        private void Disable()
        {
            m_groupBox.RemoveHandler(Mouse.PreviewMouseDownOutsideCapturedElementEvent, m_mouseButtonEventHandler);
            m_groupBox.ReleaseMouseCapture();
            m_gridButtons.IsEnabled = false;
            m_groupBox.IsEnabled = false;
        }

        private void GroupBox_Activatable_MouseDown(object sender, System.Windows.Input.MouseButtonEventArgs e)
        {
            if (sender == this && !m_groupBox.IsEnabled)
                Enable();
        }

        private void GroupBox_Activatable_LostFocus(object sender, MouseButtonEventArgs e)
        {
            if (sender == m_groupBox && m_groupBox.IsEnabled)
            {
                RaiseChangesCancelled();
                Disable();
            }
        }

        private void RaiseChangesAccepted()
        {
            if (ChangesAccepted != null)
                ChangesAccepted();
        }

        private void RaiseChangesCancelled()
        {
            if (ChangesCancelled != null)
                ChangesCancelled();
        }

        #endregion

        #endregion
    }
}
