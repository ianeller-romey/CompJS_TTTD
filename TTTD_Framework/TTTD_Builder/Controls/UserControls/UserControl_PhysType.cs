using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows;
using System.Windows.Controls;

using TTTD_Builder.Controls.Helpers;
using TTTD_Builder.Managers;
using TTTD_Builder.Model.Data;


namespace TTTD_Builder.Controls
{
    public class UserControl_PhysType : UserControl
    {
        #region MEMBER FIELDS

        private PhysType m_physType;

        private TextBlock m_textBlock_id;
        private TextBox m_textBox_name;
        private Grid_Activatable m_groupBox;

        #endregion


        #region MEMBER PROPERTIES
        #endregion


        #region MEMBER METHODS

        #region Public Functionality

        public UserControl_PhysType(PhysType physType)
        {
            m_physType = physType;

            CreateControls();

            if (m_physType == null)
            {
                m_textBlock_id.Text = "N/A";
                m_textBox_name.Text = string.Empty;
            }
            else
            {
                m_textBlock_id.Text = m_physType.Id.ToString();
                m_textBox_name.Text = m_physType.Name;
            }
        }

        #endregion


        #region Private Functionality

        private void CreateControls()
        {
            Grid grid_main = new Grid();
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
            // GroupBox
            m_groupBox = new Grid_Activatable("Phys Type", grid_main, false);
            m_groupBox.ChangesAccepted += () =>
                {
                    if (m_physType == null)
                        AddNewData();
                    else
                        UpdateExistingData();
                };
            m_groupBox.ChangesCancelled += () =>
                {
                    if (m_physType == null)
                        RevertData();
                    else
                        RevertExistingData();
                };
            Content = m_groupBox;
            
        }

        private void AddNewData()
        {
            m_physType = new PhysType();
            m_physType.Id = DataManager.GenerateId<PhysType>();
            m_physType.Name = m_textBox_name.Text;

            DataManager.PhysTypes.Add(m_physType);
        }

        private void UpdateExistingData()
        {
            m_physType.Name = m_textBox_name.Text;
        }

        private void RevertData()
        {
            m_textBox_name.Text = string.Empty;
        }

        private void RevertExistingData()
        {
            m_textBox_name.Text = m_physType.Name;
        }

        #endregion

        #endregion
    }
}
