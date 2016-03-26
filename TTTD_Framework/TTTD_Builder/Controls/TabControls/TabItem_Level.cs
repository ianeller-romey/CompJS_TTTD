using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Data;

using TTTD_Builder.EditData;
using TTTD_Builder.Controls.Helpers;
using TTTD_Builder.Managers;
using TTTD_Builder.Model.Data;


namespace TTTD_Builder.Controls.TabControls
{
    public class TabItem_Level : TabItem
    {
        #region MEMBER FIELDS

        Grid m_grid_main;
        Expander m_expander_level;
        UserControl_NewAndSelect<Level> m_comboBox_levels;
        UserControl_Level m_userControl_level;
        UserControl_LevelEditor m_userControl_levelLayout;

        #endregion


        #region MEMBER METHODS

        #region Public Functionality

        public TabItem_Level()
        {
            Header = "Levels";
            CreateControls();
        }

        #endregion


        #region Private Functionality

        private void CreateControls()
        {
            m_grid_main = new Grid();
            m_grid_main.RowDefinitions.Add(new RowDefinition() { Height = GridLength.Auto });
            m_grid_main.RowDefinitions.Add(new RowDefinition() { Height = GridLength.Auto });
            m_grid_main.RowDefinitions.Add(new RowDefinition() { Height = new GridLength(100.0, GridUnitType.Star) });

            ////////
            // ComboBox (Level)
            m_comboBox_levels = new UserControl_NewAndSelect<Level>(DataManager.Levels, New, Select);
            m_grid_main.SetRowColumn(m_comboBox_levels, 0, 0);

            ////////
            // Fin
            Content = m_grid_main;
        }

        private void RemoveUserControl()
        {
            if (m_expander_level != null)
                m_grid_main.Children.Remove(m_expander_level);
            m_expander_level = null;
            m_userControl_level = null;

            if (m_userControl_levelLayout != null)
                m_grid_main.Children.Remove(m_userControl_levelLayout);
            m_userControl_levelLayout = null;
        }

        private void New()
        {
            RemoveUserControl();
            m_userControl_level = new UserControl_Level(null);
            m_grid_main.SetRowColumn(m_userControl_level, 1, 0);
        }

        private void Select(Level level)
        {
            RemoveUserControl();
            m_userControl_level = new UserControl_Level(level);
            m_expander_level = new Expander() { Header = level.Name, Content = m_userControl_level, ExpandDirection = System.Windows.Controls.ExpandDirection.Down, IsExpanded = !level.HasLayout() };
            m_grid_main.SetRowColumn(m_expander_level, 1, 0);

            if (level != null)
            {
                m_userControl_levelLayout = new UserControl_LevelEditor(level);
                m_grid_main.SetRowColumn(m_userControl_levelLayout, 2, 0);
            }
        }

        #endregion

        #endregion
    }
}
