﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using TTTD_Builder.Model.Data.Base;


namespace TTTD_Builder.Model.Data
{
    public class AnimationStateDefinition : DataBase
    {
        #region MEMBER FIELDS

        private GraphicsInstanceDefinition m_graphicsInstanceDefinition;
        private int m_state;

        #endregion


        #region MEMBER PROPERTIES

        public GraphicsInstanceDefinition GraphicsInstanceDefinition
        {
            get { return m_graphicsInstanceDefinition; }
            set { if (value != m_graphicsInstanceDefinition) { m_graphicsInstanceDefinition = value; NotifyPropertyChanged("GraphicsInstanceDefinition"); } }
        }

        public int State
        {
            get { return m_state; }
            set { if (value != m_state) { m_state = value; NotifyPropertyChanged("State"); } }
        }

        #endregion


        #region MEMBER METHODS

        #region Public Functionality

        protected override string NameAnd()
        {
            return string.Format("{0}: State {1}, {2}", Id, State, Name);
        }

        #endregion

        #endregion
    }
}
