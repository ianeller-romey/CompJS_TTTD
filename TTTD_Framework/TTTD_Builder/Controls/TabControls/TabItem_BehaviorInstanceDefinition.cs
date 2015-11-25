using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Data;

using TTTD_Builder.Controls.Helpers;
using TTTD_Builder.Managers;
using TTTD_Builder.Model.Data;


namespace TTTD_Builder.Controls.TabControls
{
    public class TabItem_BehaviorInstanceDefinition : TabItem
    {
        #region MEMBER FIELDS

        Grid m_grid_main;
        UserControl_NewAndSelect<BehaviorInstanceDefinition> m_comboBox_behaviorInstanceDefinitions;
        UserControl_BehaviorInstanceDefinition m_userControl_behaviorInstanceDefinition;

        #endregion


        #region MEMBER METHODS

        #region Public Functionality

        public TabItem_BehaviorInstanceDefinition()
        {
            Header = "Behavior Instance Definitions";
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
            m_comboBox_behaviorInstanceDefinitions = new UserControl_NewAndSelect<BehaviorInstanceDefinition>(DataManager.BehaviorInstanceDefinitions, New, Select);
            m_grid_main.SetGridRowColumn(m_comboBox_behaviorInstanceDefinitions, 0, 0);

            ////////
            // Fin
            Content = m_grid_main;
        }

        private void RemoveUserControl()
        {
            if (m_userControl_behaviorInstanceDefinition != null)
                m_grid_main.Children.Remove(m_userControl_behaviorInstanceDefinition);
            m_userControl_behaviorInstanceDefinition = null;
        }

        private void New()
        {
            RemoveUserControl();
            m_userControl_behaviorInstanceDefinition = new UserControl_BehaviorInstanceDefinition(null);
            m_grid_main.SetGridRowColumn(m_userControl_behaviorInstanceDefinition, 1, 0);
        }

        private void Select(BehaviorInstanceDefinition behaviorInstanceDefinition)
        {
            RemoveUserControl();
            m_userControl_behaviorInstanceDefinition = new UserControl_BehaviorInstanceDefinition(behaviorInstanceDefinition);
            m_grid_main.SetGridRowColumn(m_userControl_behaviorInstanceDefinition, 1, 0);
        }

        #endregion

        #endregion
    }
}
