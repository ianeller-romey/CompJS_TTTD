using System;
using System.Collections.Generic;
using System.Windows.Input;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Data;
using System.Windows.Media;

using TTTD_Builder.Controls.Validation;
using TTTD_Builder.Lib.Data;


namespace TTTD_Builder.Controls.Helpers
{
    public abstract class UserControl_EditData : UserControl_ActivateAcceptCancel
    {
        #region MEMBER FIELDS
        #endregion


        #region MEMBER PROPERTIES
        #endregion


        #region MEMBER EVENTS

        public delegate void NewDataAddedHandler();
        public event NewDataAddedHandler NewDataAddedEvent;

        public delegate void ExistingDataUpdatedHandler();
        public event ExistingDataUpdatedHandler ExistingDataUpdatedEvent;

        public delegate void NewDataRevertedHandler();
        public event NewDataRevertedHandler NewDataRevertedEvent;

        public delegate void ExistingDataRevertedHandler();
        public event ExistingDataRevertedHandler ExistingDataRevertedEvent;

        #endregion


        #region MEMBER METHODS

        #region Public Functionality

        public UserControl_EditData(string title, bool enabled) :
            base(title, enabled)
        {
            ChangesAcceptedEvent += () =>
                {
                    if (DataIsNull())
                    {
                        AddNewData();
                        RaiseNewDataAddedEvent();
                    }
                    else
                    {
                        UpdateExistingData();
                        RaiseExistingDataUpdatedEvent();
                    }
                };
            ChangesCancelledEvent += () =>
                {
                    if (DataIsNull())
                    {
                        RevertNewData();
                        RaiseNewDataRevertedEvent();
                    }
                    else
                    {
                        RevertExistingData();
                        RaiseExistingDataRevertedEvent();
                    }
                };
        }

        #endregion


        #region Private Functionality

        protected abstract bool DataIsNull();

        protected abstract void AddNewData();

        protected abstract void UpdateExistingData();

        protected abstract void RevertNewData();

        protected abstract void RevertExistingData();

        private void RaiseNewDataAddedEvent()
        {
            if (NewDataAddedEvent != null)
                NewDataAddedEvent();
        }

        private void RaiseExistingDataUpdatedEvent()
        {
            if (ExistingDataUpdatedEvent != null)
                ExistingDataUpdatedEvent();
        }

        private void RaiseNewDataRevertedEvent()
        {
            if (NewDataRevertedEvent != null)
                NewDataRevertedEvent();
        }

        private void RaiseExistingDataRevertedEvent()
        {
            if (ExistingDataRevertedEvent != null)
                ExistingDataRevertedEvent();
        }

        #endregion

        #endregion
    }
}
