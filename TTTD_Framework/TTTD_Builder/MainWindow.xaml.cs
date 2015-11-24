using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Data;
using System.Windows.Documents;
using System.Windows.Input;
using System.Windows.Media;
using System.Windows.Media.Imaging;
using System.Windows.Navigation;
using System.Windows.Shapes;

using TTTD_Builder.Controls.Helpers;
using TTTD_Builder.Controls.TabControls;
using TTTD_Builder.Managers;


namespace TTTD_Builder
{
    /// <summary>
    /// Interaction logic for MainWindow.xaml
    /// </summary>
    public partial class MainWindow : Window
    {
        #region MEMBER FIELDS

        Menu m_menu_main;
        MenuItem
            m_menuItem_file,
            m_menuItem_loadReaderWriter,
            m_menuItem_loadData,
            m_menuItem_saveData,
            m_menuItem_setup;
        Grid m_grid_main;
        TabControl m_tabControl_controls;

        #endregion


        #region MEMBER METHODS

        #region Public Functionality

        public MainWindow()
        {
            InitializeComponent();

            Content = CreateControls();
        }

        #endregion


        #region Private Functionality

        private UIElement CreateControls()
        {
            m_menu_main = new Menu();

            ////////
            // File
            m_menuItem_loadReaderWriter = new MenuItem() { Header = "Load ReaderWriter DLL" };
            m_menuItem_loadReaderWriter.Click += MenuItem_LoadReaderWriter_Click;

            m_menuItem_file = new MenuItem() { Header = "File" };
            m_menuItem_file.Items.Add(m_menuItem_loadReaderWriter);

            m_menu_main.Items.Add(m_menuItem_file);

            ////////
            // Toolbar
            DockPanel dockPanel_main = new DockPanel();
            dockPanel_main.Children.Add(m_menu_main);
            DockPanel.SetDock(m_menu_main, Dock.Top);

            ////////
            // grid
            m_grid_main = new Grid();
            m_grid_main.RowDefinitions.Add(new RowDefinition() { Height = GridLength.Auto });
            m_grid_main.RowDefinitions.Add(new RowDefinition() { Height = new GridLength(100.0, GridUnitType.Star) });
            m_grid_main.SetGridRowColumn(dockPanel_main, 0, 0);

            return m_grid_main;
        }

        private void MenuItem_LoadReaderWriter_Click(object sender, RoutedEventArgs e)
        {
            var menuItem = sender as MenuItem;
            if (menuItem != null && menuItem == m_menuItem_loadReaderWriter)
            {
                var window = new Window_OpenFile("Select ReaderWriter DLL", string.Empty, new[] { new Window_OpenFile.Filter("DLL Files (.dll)", "*.dll") });
                window.ShowDialog();
                if (window.Accepted)
                {
                    ReaderWriterManager.LoadDLL(window.FileName);

                    ////////
                    // MenuItems
                    m_menuItem_loadData = new MenuItem() { Header = "Load Data" };
                    m_menuItem_loadData.Click += MenuItem_LoadData_Click;
                    m_menuItem_file.Items.Add(m_menuItem_loadData);

                    m_menuItem_saveData = new MenuItem() { Header = "Save Data" };
                    m_menuItem_saveData.Click += MenuItem_SaveData_Click;
                    m_menuItem_file.Items.Add(m_menuItem_saveData);

                    m_menuItem_setup = new MenuItem() { Header = "Setup" };
                    m_menuItem_setup.Click += MenuItem_Setup_Click;
                    m_menuItem_file.Items.Add(m_menuItem_setup);

                    ////////
                    // Additional controls
                    CreateAdditionalControls();
                }
            }
        }

        private void MenuItem_LoadData_Click(object sender, RoutedEventArgs e)
        {
            RemoveAdditionalControls();
            DataManager.Load();
            CreateAdditionalControls();
        }

        private void MenuItem_SaveData_Click(object sender, RoutedEventArgs e)
        {
            DataManager.Save();
        }

        private void MenuItem_Setup_Click(object sender, RoutedEventArgs e)
        {
            //throw new NotImplementedException();
        }

        private void RemoveAdditionalControls()
        {
            m_tabControl_controls.Items.Clear();
            m_grid_main.Children.Remove(m_tabControl_controls);
        }

        private void CreateAdditionalControls()
        {
            ////////
            // TabControls
            TabItem tabItem_audio = new TabItem() { Header = "Audio" };

            TabItem tabItem_behavior = new TabItem() { Header = "Behavior" };

            TabItem tabItem_graphics = new TabItem() { Header = "Graphics" };

            TabControl tabControl_physics = new TabControl();
            tabControl_physics.Items.Add(new TabItem_CollisionType());
            tabControl_physics.Items.Add(new TabItem_PhysType());
            TabItem tabItem_physics = new TabItem() { Header = "Physics" };
            tabItem_physics.Content = tabControl_physics;

            m_tabControl_controls = new TabControl();
            m_tabControl_controls.Items.Add(tabItem_physics);
            m_grid_main.SetGridRowColumn(m_tabControl_controls, 1, 0);
        }

        #endregion

        #endregion
    }
}
