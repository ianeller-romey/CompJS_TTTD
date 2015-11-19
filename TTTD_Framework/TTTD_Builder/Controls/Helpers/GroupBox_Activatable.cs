using System;
using System.Collections.Generic;
using System.Windows.Input;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows;
using System.Windows.Controls;

using TTTD_Builder.Lib.Data;


namespace TTTD_Builder.Controls.Helpers
{
    public class GroupBox_Activatable : GroupBox
    {
        #region MEMBER FIELDS

        private MouseButtonEventHandler m_mouseButtonEventHandler;

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

        public GroupBox_Activatable(string title, UIElement content, bool enabled)
        {
            m_mouseButtonEventHandler = new MouseButtonEventHandler(GroupBox_Activatable_LostFocus);

            Header = title;
            Content = content;
            IsEnabled = enabled;

            MouseDoubleClick += GroupBox_Activatable_MouseDoubleClick;
            IsMouseCapturedChanged += GroupBox_Activatable_IsMouseCapturedChanged;
        }

        #endregion


        #region Private Functionality

        private void CreateControls(UIElement content)
        {
            Grid grid_main = new Grid();
            grid_main.RowDefinitions.Add(new RowDefinition() { Height = new GridLength(100.0, GridUnitType.Star) });
            grid_main.RowDefinitions.Add(new RowDefinition() { Height = GridLength.Auto });

            Grid grid_buttons = new Grid();
            grid_buttons.ColumnDefinitions.Add(new ColumnDefinition() { Width = new GridLength(50.0, GridUnitType.Star) });
            grid_buttons.ColumnDefinitions.Add(new ColumnDefinition() { Width = new GridLength(50.0, GridUnitType.Star) });
            grid_main.SetGridRowColumn(grid_buttons, 1, 0);

            Button button_accept = new Button() { Content = "Accept" };
            button_accept.Click += (sender, args) => { RaiseChangesAccepted(); Disable(); };
            grid_buttons.SetGridRowColumn(button_accept, 0, 0);

            Button button_cancel = new Button() { Content = "Cancel" };
            button_cancel.Click += (sender, args) => { RaiseChangesCancelled(); Disable(); };
            grid_buttons.SetGridRowColumn(button_cancel, 0, 1);

            if (content != null)
                grid_main.SetGridRowColumn(content, 0, 0);
            Content = grid_main;
        }

        private void Enable()
        {
            IsEnabled = true;
            Mouse.Capture(this, CaptureMode.SubTree);
            AddHandler(Mouse.PreviewMouseDownOutsideCapturedElementEvent, m_mouseButtonEventHandler, true);
        }

        private void Disable()
        {
            RemoveHandler(Mouse.PreviewMouseDownOutsideCapturedElementEvent, m_mouseButtonEventHandler);
            ReleaseMouseCapture();
            IsEnabled = false;
        }

        private void GroupBox_Activatable_MouseDoubleClick(object sender, System.Windows.Input.MouseButtonEventArgs e)
        {
            if (sender == this && !IsEnabled)
                Enable();
        }

        private void GroupBox_Activatable_LostFocus(object sender, MouseButtonEventArgs e)
        {
            if (sender == this && IsEnabled)
            {
                RaiseChangesCancelled();
                Disable();
            }
        }

        private void GroupBox_Activatable_IsMouseCapturedChanged(object sender, DependencyPropertyChangedEventArgs e)
        {
            if (sender == this && (bool)e.NewValue == false)
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
