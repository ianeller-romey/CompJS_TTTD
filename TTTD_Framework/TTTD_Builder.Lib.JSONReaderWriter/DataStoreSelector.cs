using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using Newtonsoft.Json;


namespace TTTD_Builder.Lib.JSONReaderWriter
{
    public class DataStoreSelector : IDataStoreSelector
    {
        #region MEMBER FIELDS

        #endregion


        #region MEMBER PROPERTIES

        public string DataStore
        {
            get;
            private set;
        }

        #endregion


        #region MEMBER METHODS

        #region Public Functionality

        public bool Select()
        {
            System.Windows.Forms.FolderBrowserDialog selectDirectoryDialog =
                new System.Windows.Forms.FolderBrowserDialog()
                {
                    SelectedPath = DataStore
                };
            if (selectDirectoryDialog.ShowDialog() == System.Windows.Forms.DialogResult.OK)
            {
                DataStore = selectDirectoryDialog.SelectedPath;
                return true;
            }
            else
                return false;
        }

        #endregion

        #endregion
    }
}
