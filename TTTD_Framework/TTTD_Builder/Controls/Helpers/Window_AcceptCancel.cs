using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows;
using System.Windows.Controls;


namespace TTTD_Builder.Controls.Helpers
{
    public class Window_AcceptCancel : Window
    {

        #region MEMBER PROPERTIES

        public bool Accepted { get; private set; }

        #endregion


        #region MEMBER METHODS

        #region Public Functionality

        public Window_AcceptCancel()
        {
            Accepted = false;

            WindowStartupLocation = System.Windows.WindowStartupLocation.CenterScreen;
            Topmost = true;

            Loaded += Window_AcceptCancel_Loaded;
        }

        #endregion


        #region Private Functionality

        private void EncapsulateControls()
        {
            Grid grid_main = new Grid();
            grid_main.RowDefinitions.Add(new RowDefinition() { Height = new GridLength(100.0, GridUnitType.Star) });
            grid_main.RowDefinitions.Add(new RowDefinition() { Height = GridLength.Auto });

            Grid grid_buttons = new Grid();
            grid_buttons.ColumnDefinitions.Add(new ColumnDefinition() { Width = new GridLength(50.0, GridUnitType.Star) });
            grid_buttons.ColumnDefinitions.Add(new ColumnDefinition() { Width = new GridLength(50.0, GridUnitType.Star) });
            grid_main.SetGridRowColumn(grid_buttons, 1, 0);

            Button button_accept = new Button() { Content = "Accept" };
            button_accept.Click += (sender, args) => { Accepted = true; Close(); };
            grid_buttons.SetGridRowColumn(button_accept, 0, 0);

            Button button_cancel = new Button() { Content = "Cancel" };
            button_cancel.Click += (sender, args) => { Close(); };
            grid_buttons.SetGridRowColumn(button_cancel, 0, 1);

            UIElement thatContent = Content as UIElement;
            Content = null;
            if (thatContent != null)
                grid_main.SetGridRowColumn(thatContent, 0, 0);
            Content = grid_main;
        }

        private void Window_AcceptCancel_Loaded(object sender, RoutedEventArgs e)
        {
            EncapsulateControls();
        }

        #endregion

        #endregion

    }
}
