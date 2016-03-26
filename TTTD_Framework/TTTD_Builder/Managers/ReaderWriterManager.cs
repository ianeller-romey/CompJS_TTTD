using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;

using TTTD_DataReaderWriter;


namespace TTTD_Builder.Managers
{
    public static class ReaderWriterManager
    {
        #region MEMBER FIELDS

        static Assembly m_assembly = null;
        static Type m_readerType,
                    m_writerType,
                    m_dataStoreSelectorType;
        static dynamic m_reader,
                       m_writer,
                       m_dataStoreSelector;

        #endregion


        #region MEMBER METHODS

        #region Public Functionality

        public static void LoadDLL(string fileName)
        {
            if (File.Exists(fileName))
            {
                m_assembly = Assembly.LoadFile(fileName);
                var types = m_assembly.GetExportedTypes();
                m_readerType = types.FirstOrDefault(x => x.GetInterface(typeof(IReader).Name) != null);
                m_writerType = types.FirstOrDefault(x => x.GetInterface(typeof(IWriter).Name) != null);
                m_dataStoreSelectorType = types.FirstOrDefault(x => x.GetInterface(typeof(IDataStoreSelector).Name) != null);
                if (m_readerType != null && m_writerType != null)
                {
                    m_reader = Activator.CreateInstance(m_readerType);
                    m_writer = Activator.CreateInstance(m_writerType);

                    Config.ReaderWriterDll = fileName;
                }
            }
        }

        public static IEnumerable<T> Read<T>()
        {
            var r = (m_reader != null) ? m_reader.Read<T>(m_dataStoreSelector, Config.DataDirectory) : null;
            Config.DataDirectory = m_dataStoreSelector.DataStore;
            return r;
        }

        public static void Write<T>(IEnumerable<T> objectsToWrite)
        {
            if (m_writer != null)
            {
                m_writer.Write<T>(objectsToWrite, m_dataStoreSelector, Config.DataDirectory);
                Config.DataDirectory = m_dataStoreSelector.DataStore;
            }
        }

        public static void CreateDataStoreSelector()
        {
            m_dataStoreSelector = Activator.CreateInstance(m_dataStoreSelectorType);
        }

        #endregion


        #region Private Functionality
        #endregion

        #endregion
    }
}