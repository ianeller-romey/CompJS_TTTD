using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;


namespace TTTD_DataReaderWriter
{
    public class DataStorePassThrough : IDataStoreSelector
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

        public DataStorePassThrough(string defaultDataStore)
        {
            SetDefault(defaultDataStore);
        }

        public void SetDefault(string defaultDataStore)
        {
            DataStore = defaultDataStore;
        }

        public bool Select(string defaultDataStore)
        {
            if (DataStore != defaultDataStore)
                DataStore = defaultDataStore;
            return true;
        }

        #endregion

        #endregion
    }
}
