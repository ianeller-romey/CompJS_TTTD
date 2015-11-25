using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows;
using System.Windows.Controls;

using Xceed.Wpf.Toolkit;

using TTTD_Builder.Controls.Helpers;
using TTTD_Builder.Managers;
using TTTD_Builder.Model.Data;


namespace TTTD_Builder.Controls
{
    public class UserControl_Level : UserControl
    {
        #region MEMBER FIELDS

        private Level m_level;

        private TextBlock m_textBlock_id;
        private TextBox m_textBox_name;
        private IntegerUpDown m_integerUpDown_order;
        private Grid_Activatable m_groupBox;

        #endregion


        #region MEMBER PROPERTIES
        #endregion


        #region MEMBER METHODS

        #region Public Functionality

        public UserControl_Level(Level level)
        {
            m_level = level;

            CreateControls();

            if (m_level == null)
            {
                m_textBlock_id.Text = "N/A";
                m_textBox_name.Text = string.Empty;
                m_integerUpDown_order.Value = null;
            }
            else
            {
                m_textBlock_id.Text = m_level.Id.ToString();
                m_textBox_name.Text = m_level.Name;
                m_integerUpDown_order.Value = m_level.Order;
            }
        }

        #endregion


        #region Private Functionality

        private void CreateControls()
        {
            Grid grid_main = new Grid();
            grid_main.RowDefinitions.Add(new RowDefinition() { Height = GridLength.Auto });
            grid_main.RowDefinitions.Add(new RowDefinition() { Height = GridLength.Auto });
            grid_main.RowDefinitions.Add(new RowDefinition() { Height = GridLength.Auto });

            ////////
            // Id
            m_textBlock_id = new TextBlock() { VerticalAlignment = VerticalAlignment.Center };
            Label label_id = new Label() { Content = "Id: ", FontWeight = FontWeights.Bold, VerticalAlignment = VerticalAlignment.Center };
            Grid grid_id = new Grid();
            grid_id.ColumnDefinitions.Add(new ColumnDefinition() { Width = GridLength.Auto });
            grid_id.ColumnDefinitions.Add(new ColumnDefinition() { Width = GridLength.Auto });
            grid_id.SetGridRowColumn(m_textBlock_id, 0, 1);
            grid_id.SetGridRowColumn(label_id, 0, 0);
            grid_main.SetGridRowColumn(grid_id, 0, 0);

            ////////
            // Name
            m_textBox_name = new TextBox() { VerticalAlignment = VerticalAlignment.Center };
            Label label_name = new Label() { Content = "Name: ", FontWeight = FontWeights.Bold, VerticalAlignment = VerticalAlignment.Center };
            Grid grid_name = new Grid();
            grid_name.RowDefinitions.Add(new RowDefinition() { Height = GridLength.Auto });
            grid_name.RowDefinitions.Add(new RowDefinition() { Height = GridLength.Auto });
            grid_name.SetGridRowColumn(m_textBox_name, 1, 0);
            grid_name.SetGridRowColumn(label_name, 0, 0);
            grid_main.SetGridRowColumn(grid_name, 1, 0);

            ////////
            // Order
            m_integerUpDown_order = new IntegerUpDown() { VerticalAlignment = VerticalAlignment.Center };
            Label label_order = new Label() { Content = "Order: ", FontWeight = FontWeights.Bold, VerticalAlignment = VerticalAlignment.Center };
            Grid grid_order = new Grid();
            grid_order.RowDefinitions.Add(new RowDefinition() { Height = GridLength.Auto });
            grid_order.RowDefinitions.Add(new RowDefinition() { Height = GridLength.Auto });
            grid_order.SetGridRowColumn(m_integerUpDown_order, 1, 0);
            grid_order.SetGridRowColumn(label_order, 0, 0);
            grid_main.SetGridRowColumn(grid_order, 2, 0);

            ////////
            // GroupBox
            m_groupBox = new Grid_Activatable("Level", grid_main, false);
            m_groupBox.ChangesAccepted += () =>
                {
                    if (m_level == null)
                        AddNewData();
                    else
                        UpdateExistingData();
                };
            m_groupBox.ChangesCancelled += () =>
                {
                    if (m_level == null)
                        RevertData();
                    else
                        RevertExistingData();
                };
            Content = m_groupBox;
            
        }

        private void AddNewData()
        {
            m_level = new Level();
            m_level.Id = DataManager.GenerateId<Level>();
            m_level.Name = m_textBox_name.Text;
            m_level.Order = m_integerUpDown_order.Value;

            DataManager.Levels.Add(m_level);
        }

        private void UpdateExistingData()
        {
            m_level.Name = m_textBox_name.Text;
            m_level.Order = m_integerUpDown_order.Value;
        }

        private void RevertData()
        {
            m_textBox_name.Text = string.Empty;
            m_integerUpDown_order.Value = null;
        }

        private void RevertExistingData()
        {
            m_textBox_name.Text = m_level.Name;
            m_integerUpDown_order.Value = m_level.Order;
        }

        #endregion

        #endregion
    }
}
