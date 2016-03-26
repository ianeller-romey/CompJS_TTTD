using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using Newtonsoft.Json;


namespace TTTD_DataReaderWriter.JSON
{
    public class DataStoreSelector : TTTD_DataReaderWriter.IDataStoreSelector
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

        public void SetDefault(string defaultDataStore)
        {
            DataStore = defaultDataStore;
        }

        public bool Select(string defaultDataStore)
        {
            System.Windows.Forms.FolderBrowserDialog selectDirectoryDialog =
                new System.Windows.Forms.FolderBrowserDialog()
                {
                    RootFolder = Environment.SpecialFolder.Desktop,
                    SelectedPath = defaultDataStore
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
