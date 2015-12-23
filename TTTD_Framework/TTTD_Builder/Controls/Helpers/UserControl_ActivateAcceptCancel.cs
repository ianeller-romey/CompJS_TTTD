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
    public abstract class UserControl_ActivateAcceptCancel : UserControl
    {
        #region MEMBER FIELDS

        private MouseButtonEventHandler m_mouseButtonEventHandler;

        private GroupBox m_groupBox;
        private Grid m_grid_main;
        private Button m_button_accept;
        private UIElement m_uiElement_firstFocus;

        #endregion


        #region MEMBER PROPERTIES

        protected ActivatableContent ThisContent
        {
            get;
            set;
        }

        #endregion


        #region MEMBER CLASSES

        protected class ActivatableContent
        {
            public UIElement Content
            {
                get;
                set;
            }

            public UIElement FirstFocus
            {
                get;
                set;
            }

            public IEnumerable<ValidatorBase> Validators
            {
                get;
                set;
            }
        }

        #endregion


        #region MEMBER EVENTS

        public delegate void ChangesAcceptedHandler();
        public event ChangesAcceptedHandler ChangesAcceptedEvent;

        public delegate void ChangesCancelledHandler();
        public event ChangesCancelledHandler ChangesCancelledEvent;

        #endregion


        #region MEMBER METHODS

        #region Public Functionality

        public UserControl_ActivateAcceptCancel(string title, bool enabled)
        {
            m_mouseButtonEventHandler = new MouseButtonEventHandler(GroupBox_Activatable_LostFocus);

            CreateControls(title, enabled);
            SetThisContent();

            this.Margin = new Thickness(0.0, 0.0, 0.0, 10.0);

            MouseDown += GroupBox_Activatable_MouseDown;
            Loaded += UserControl_ActivateAcceptCancel_Loaded;
        }

        #endregion


        #region Private Functionality

        protected abstract void SetThisContent();

        private void CreateControls(string title, bool enabled)
        {
            m_grid_main = new Grid() { Background = Brushes.Transparent };
            m_grid_main.RowDefinitions.Add(new RowDefinition() { Height = new GridLength(100.0, GridUnitType.Star) });
            m_grid_main.RowDefinitions.Add(new RowDefinition() { Height = GridLength.Auto });
            m_grid_main.RowDefinitions.Add(new RowDefinition() { Height = GridLength.Auto });

            m_groupBox =
                new GroupBox()
                {
                    Header = title,
                    Content = m_grid_main,
                    IsEnabled = enabled,
                };
            Content = m_groupBox;

            m_grid_main.SetGridRowColumn(new Separator() { Margin = new Thickness(0.0, 10.0, 0.0, 5.0) } , 1, 0);

            Grid grid_buttons = new Grid();
            grid_buttons.ColumnDefinitions.Add(new ColumnDefinition() { Width = new GridLength(50.0, GridUnitType.Star) });
            grid_buttons.ColumnDefinitions.Add(new ColumnDefinition() { Width = new GridLength(50.0, GridUnitType.Star) });
            m_grid_main.SetGridRowColumn(grid_buttons, 2, 0);

            m_button_accept = new Button() { Content = "Accept" };
            m_button_accept.Click += (sender, args) => 
            {
                RaiseChangesAccepted(); Disable(); 
            };
            grid_buttons.SetGridRowColumn(m_button_accept, 0, 0);

            Button button_cancel = new Button() { Content = "Cancel" };
            button_cancel.Click += (sender, args) => { RaiseChangesCancelled(); Disable(); };
            grid_buttons.SetGridRowColumn(button_cancel, 0, 1);
        }

        private void CreateContent()
        {
            if (ThisContent != null)
            {
                if (ThisContent.Content != null)
                    m_grid_main.SetGridRowColumn(ThisContent.Content, 0, 0);

                if (ThisContent.FirstFocus != null)
                    m_uiElement_firstFocus = ThisContent.FirstFocus;

                if (ThisContent.Validators != null)
                {
                    MultiBinding multiBinding = new MultiBinding() { Converter = new AllValidationsConverter() };
                    foreach (var v in ThisContent.Validators)
                    {
                        Binding binding = new Binding("Valid") { Source = v, Mode = BindingMode.OneWay };
                        multiBinding.Bindings.Add(binding);
                    }
                    m_button_accept.SetBinding(UIElement.IsEnabledProperty, multiBinding);
                }
            }
            Loaded -= UserControl_ActivateAcceptCancel_Loaded;
        }

        private void UserControl_ActivateAcceptCancel_Loaded(object sender, RoutedEventArgs e)
        {
            CreateContent();
        }

        private void Enable()
        {
            m_groupBox.IsEnabled = true;
            Mouse.Capture(m_groupBox, CaptureMode.SubTree);
            m_groupBox.AddHandler(Mouse.PreviewMouseDownOutsideCapturedElementEvent, m_mouseButtonEventHandler, true);
            m_uiElement_firstFocus.Focus();
        }

        private void Disable()
        {
            m_groupBox.RemoveHandler(Mouse.PreviewMouseDownOutsideCapturedElementEvent, m_mouseButtonEventHandler);
            m_groupBox.ReleaseMouseCapture();
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
            if (ChangesAcceptedEvent != null)
                ChangesAcceptedEvent();
        }

        private void RaiseChangesCancelled()
        {
            if (ChangesCancelledEvent != null)
                ChangesCancelledEvent();
        }

        #endregion

        #endregion
    }
}
