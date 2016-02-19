using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows;
using System.Windows.Controls;

using Xceed.Wpf.Toolkit;

using TTTD_Builder.Controls.Helpers;
using TTTD_Builder.Controls.Validation;
using TTTD_Builder.Managers;
using TTTD_Builder.Model.Data;


namespace TTTD_Builder.EditData
{
    public class UserControl_Level : UserControl_EditData
    {
        #region MEMBER FIELDS

        private Level m_level;

        private TextBlock m_textBlock_id;
        private TextBox m_textBox_name;
        private IntegerUpDown m_integerUpDown_order;

        #endregion


        #region MEMBER PROPERTIES
        #endregion


        #region MEMBER METHODS

        #region Public Functionality

        public UserControl_Level(Level level) :
            base("Level", false)
        {
            m_level = level;

            if (DataIsNull())
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

        protected override void SetThisContent()
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
            ValidatorPanel validator_name = new ValidatorPanel(m_textBox_name, TextBox.TextProperty, new Validate_StringIsNotNullOrEmpty());
            Label label_name = new Label() { Content = "Name: ", FontWeight = FontWeights.Bold, VerticalAlignment = VerticalAlignment.Center };
            Grid grid_name = new Grid();
            grid_name.RowDefinitions.Add(new RowDefinition() { Height = GridLength.Auto });
            grid_name.RowDefinitions.Add(new RowDefinition() { Height = GridLength.Auto });
            grid_name.SetGridRowColumn(validator_name, 1, 0);
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
            // FIN
            ThisContent = new ActivatableContent() { Content = grid_main, FirstFocus = m_textBox_name, Validators = new ValidatorBase[] {
                validator_name
            }};
        }

        protected override bool DataIsNull()
        {
            return m_level == null;
        }

        protected override int AddNewData()
        {
            m_level = DataManager.Generate<Level>();
            m_level.Name = m_textBox_name.Text;
            m_level.Order = m_integerUpDown_order.Value;

            DataManager.Levels.Add(m_level);

            return m_level.Id;
        }

        protected override int UpdateExistingData()
        {
            m_level.Name = m_textBox_name.Text;
            m_level.Order = m_integerUpDown_order.Value;

            return m_level.Id;
        }

        protected override void RevertNewData()
        {
            m_textBox_name.Text = string.Empty;
            m_integerUpDown_order.Value = null;
        }

        protected override void RevertExistingData()
        {
            m_textBox_name.Text = m_level.Name;
            m_integerUpDown_order.Value = m_level.Order;
        }

        #endregion

        #endregion
    }
}
