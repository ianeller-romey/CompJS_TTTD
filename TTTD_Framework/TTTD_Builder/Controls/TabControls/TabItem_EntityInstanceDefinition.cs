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
    public class TabItem_EntityInstanceDefinition : TabItem
    {
        #region MEMBER FIELDS

        Grid m_grid_main;
        UserControl_NewAndSelect<EntityInstanceDefinition> m_comboBox_entityInstanceDefinitions;
        UserControl_EntityInstanceDefinition m_userControl_entityInstanceDefinition;

        #endregion


        #region MEMBER METHODS

        #region Public Functionality

        public TabItem_EntityInstanceDefinition()
        {
            Header = "Entity Instance Definitions";
            CreateControls();
        }

        #endregion


        #region Private Functionality

        private void CreateControls()
        {
            m_grid_main = new Grid();
            m_grid_main.RowDefinitions.Add(new RowDefinition() { Height = GridLength.Auto });
            m_grid_main.RowDefinitions.Add(new RowDefinition() { Height = new GridLength(100.0, GridUnitType.Star) });

            ////////
            // ComboBox
            m_comboBox_entityInstanceDefinitions = new UserControl_NewAndSelect<EntityInstanceDefinition>(DataManager.EntityInstanceDefinitions, New, Select);
            m_grid_main.SetGridRowColumn(m_comboBox_entityInstanceDefinitions, 0, 0);

            ////////
            // Fin
            Content = m_grid_main;
        }

        private void RemoveUserControl()
        {
            if (m_userControl_entityInstanceDefinition != null)
                m_grid_main.Children.Remove(m_userControl_entityInstanceDefinition);
            m_userControl_entityInstanceDefinition = null;
        }

        private void New()
        {
            RemoveUserControl();
            m_userControl_entityInstanceDefinition = new UserControl_EntityInstanceDefinition(null);
            m_grid_main.SetGridRowColumn(m_userControl_entityInstanceDefinition, 1, 0);
        }

        private void Select(EntityInstanceDefinition entityInstanceDefinition)
        {
            RemoveUserControl();
            m_userControl_entityInstanceDefinition = new UserControl_EntityInstanceDefinition(entityInstanceDefinition);
            m_grid_main.SetGridRowColumn(m_userControl_entityInstanceDefinition, 1, 0);
        }

        #endregion

        #endregion
    }
}
