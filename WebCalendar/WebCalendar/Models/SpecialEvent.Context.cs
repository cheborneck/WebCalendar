﻿//------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated from a template.
//
//     Manual changes to this file may cause unexpected behavior in your application.
//     Manual changes to this file will be overwritten if the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

namespace WebCalendar.Models
{
    using System;
    using System.Data.Entity;
    using System.Data.Entity.Infrastructure;
    using System.Data.Entity.Core.Objects;
    using System.Linq;
    
    public partial class SpecialEventsEntities : DbContext
    {
        public SpecialEventsEntities()
            : base("name=SpecialEventsEntities")
        {
        }
    
        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            throw new UnintentionalCodeFirstException();
        }
    
        public virtual DbSet<Event> Events { get; set; }
    
        public virtual ObjectResult<procWebGetEvent_Result> procWebGetEvent(Nullable<System.DateTime> day)
        {
            var dayParameter = day.HasValue ?
                new ObjectParameter("Day", day) :
                new ObjectParameter("Day", typeof(System.DateTime));
    
            return ((IObjectContextAdapter)this).ObjectContext.ExecuteFunction<procWebGetEvent_Result>("procWebGetEvent", dayParameter);
        }
    }
}
