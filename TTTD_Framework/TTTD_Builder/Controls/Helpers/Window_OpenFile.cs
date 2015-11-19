using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows;
using System.Windows.Controls;


namespace TTTD_Builder.Controls.Helpers
{
    public class Window_OpenFile : Window_AcceptCancel
    {
        #region MEMBER FIELDS

        TextBox m_textBox_fileName;

        #endregion


        #region MEMBER PROPERTIES

        public string FileName { get; private set; }

        #endregion


        #region MEMBER CLASSES

        public class Filter
        {
            #region MEMBER PROPERTIES

            public string DisplayName { get; private set; }
            public string Extension { get; private set; }

            #endregion


            #region MEMBER METHODS

            #region Public Functionality

            public Filter(string displayName, string extension)
            {
                DisplayName = displayName;
                Extension = extension;
            }

            public override string ToString()
            {
 	             return string.Format("{0}|{1}", DisplayName, Extension);
            }

            #endregion

            #endregion
        }

        #endregion


        #region MEMBER METHODS

        #region Public Functionality

        public Window_OpenFile(string title, string fileName, IEnumerable<Filter> filters = null)
        {
            Title = title;
            Height = 100;
            Width = 300;
            Content = CreateContent(fileName, filters);
        }

        #endregion


        #region Private Functionality

        public UIElement CreateContent(string fileName, IEnumerable<Filter> filters)
        {
            Grid grid_main = new Grid();
            grid_main.ColumnDefinitions.Add(new ColumnDefinition() { Width = new GridLength(100.0, GridUnitType.Star) });
            grid_main.ColumnDefinitions.Add(new ColumnDefinition() { Width = GridLength.Auto });

            m_textBox_fileName = new TextBox();
            m_textBox_fileName.TextChanged += (sender, args) => { FileName = m_textBox_fileName.Text; };
            m_textBox_fileName.Text = fileName;
            grid_main.SetGridRowColumn(m_textBox_fileName, 0, 0);

            Button button_openFile = new Button() { Content = "Open file ..." };
            button_openFile.Click += (x, y) =>
            {
                System.Windows.Forms.OpenFileDialog openFileDialog =
                    new System.Windows.Forms.OpenFileDialog()
                    {
                        Filter = (filters != null) ? filters.Select(f => f.ToString()).Aggregate((a,b) => string.Format("{0}|{1}", a, b)) : string.Empty,
                        CheckFileExists = true,
                        CheckPathExists = true
                    };
                if (openFileDialog.ShowDialog() == System.Windows.Forms.DialogResult.OK)
                    m_textBox_fileName.Text = openFileDialog.FileName;
            };
            grid_main.SetGridRowColumn(button_openFile, 0, 1);

            return grid_main;
        }

        #endregion

        #endregion
    }
}
