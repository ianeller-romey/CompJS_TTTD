﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows;
using System.Windows.Controls;

using TTTD_Builder.Controls.Helpers;
using TTTD_Builder.Controls.Validation;
using TTTD_Builder.Managers;
using TTTD_Builder.Model.Data;


namespace TTTD_Builder.EditData
{
    public class UserControl_AudioType : UserControl_EditData
    {
        #region MEMBER FIELDS

        private AudioType m_audioType;

        private TextBlock m_textBlock_id;
        private TextBox m_textBox_name;

        #endregion


        #region MEMBER PROPERTIES
        #endregion


        #region MEMBER METHODS

        #region Public Functionality

        public UserControl_AudioType(AudioType audioType) :
            base("Audio Type", false)
        {
            m_audioType = audioType;

            if (DataIsNull())
            {
                m_textBlock_id.Text = "N/A";
                m_textBox_name.Text = string.Empty;
            }
            else
            {
                m_textBlock_id.Text = m_audioType.Id.ToString();
                m_textBox_name.Text = m_audioType.Name;
            }
        }

        #endregion


        #region Private Functionality

        protected override void SetThisContent()
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
            ValidatorPanel validator_name = new ValidatorPanel(m_textBox_name, TextBox.TextProperty, new Validate_StringIsNotNullOrEmpty());
            Label label_name = new Label() { Content = "Name: ", FontWeight = FontWeights.Bold, VerticalAlignment = VerticalAlignment.Center };
            Grid grid_name = new Grid();
            grid_name.RowDefinitions.Add(new RowDefinition() { Height = GridLength.Auto });
            grid_name.RowDefinitions.Add(new RowDefinition() { Height = GridLength.Auto });
            grid_name.SetGridRowColumn(validator_name, 1, 0);
            grid_name.SetGridRowColumn(label_name, 0, 0);
            grid_main.SetGridRowColumn(grid_name, 1, 0);

            ////////
            // FIN
            ThisContent = new ActivatableContent() { Content = grid_main, FirstFocus = m_textBox_name, Validators = new ValidatorBase[] {
                validator_name
            }};
        }

        protected override bool DataIsNull()
        {
            return m_audioType == null;
        }

        protected override int AddNewData()
        {
            m_audioType = DataManager.Generate<AudioType>();
            m_audioType.Name = m_textBox_name.Text;

            DataManager.AudioTypes.Add(m_audioType);

            return m_audioType.Id;  
        }

        protected override int UpdateExistingData()
        {
            m_audioType.Name = m_textBox_name.Text;

            return m_audioType.Id;  
        }

        protected override void RevertNewData()
        {
            m_textBox_name.Text = string.Empty;
        }

        protected override void RevertExistingData()
        {
            m_textBox_name.Text = m_audioType.Name;
        }

        #endregion

        #endregion
    }
}
