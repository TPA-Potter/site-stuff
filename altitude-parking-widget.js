
(function(jQuery){
  $ = jQuery.noConflict();

  var defaults = { 
      inputFormat: "J M Y",
      dateFormat: 'm/d/Y',
      dowFormat: "l",
      defaultDuration: 5
      
      
  };

  var AltitudeParkingWidget = function(form, options)
  {
    var self = this;
    this.options = $.extend({}, defaults, AltitudeParkingWidget.defaultOptions, options);

    this.$form = $(form)
    this.$form.on('submit', function() { return self.onSubmit() });

    this.$arrivalDateTime = $('[data-arrival-date-time]', this.$form)
    this.$arrivalDate = $('[data-arrival-date]', this.$form)
    this.$arrivalTime = $('[data-arrival-time]', this.$form)
    this.$arrivalDow = $('[data-arrival-dow]', this.$form)

    this.$departureDateTime = $('[data-departure-date-time]', this.$form)
    this.$departureDate = $('[data-departure-date]', this.$form)
    this.$departureTime = $('[data-departure-time]', this.$form)
    this.$departureDow = $('[data-departure-dow]', this.$form)

    var minLeadTime = new Date();

    var defaultArrDate = new Date(minLeadTime);
    defaultArrDate.setDate(defaultArrDate.getDate() + 1)
   

    if (minLeadTime >= defaultArrDate) {
        defaultArrDate = (new Date()).fp_incr(1);
        
    }

    this.$arrivalDateTime.flatpickr({	
      
      dateFormat: this.options.inputFormat,
      
      defaultDate: defaultArrDate,
      minDate: new Date().fp_incr(1),
      maxDate: new Date().fp_incr(365),	  
      onChange: function(selectedDates, dateStr, instance) {
        self.arrivalDateChanged(selectedDates[0])
      }
    });
	

    var defaultDepDate = defaultArrDate.fp_incr(this.options.defaultDuration);

    this.$departureDateTime.flatpickr({
      
      dateFormat: this.options.inputFormat,
      defaultDate: defaultDepDate,
      minDate: defaultArrDate,
      maxDate: new Date().fp_incr(365),
      onChange: function(selectedDates, dateStr, instance) {
        self.departureDateChanged(selectedDates[0])
      }
    });

    this.arrivalPicker = this.$arrivalDateTime[0]._flatpickr;
    this.departurePicker = this.$departureDateTime[0]._flatpickr;

    $('[data-arrival-toggle]', this.$form).on('click', function() {
      self.arrivalPicker.open();
    })

    $('[data-departure-toggle]', this.$form).on('click', function() {
      self.departurePicker.open()
    })

    this.updateDates()
  }

  AltitudeParkingWidget.defaultOptions = defaults;

  AltitudeParkingWidget.prototype.arrivalDateChanged = function(date) {
    var depDate = this.departurePicker.selectedDates[0];
    if (depDate <= date)
    {
        var newDepartureDate = date.fp_incr(5);
        newDepartureDate.setHours(depDate.getHours(), depDate.getMinutes());
        this.departurePicker.setDate(newDepartureDate)
    }

    this.departurePicker.set('minDate', date)

    if (this.departurePicker.isOpen)
      this.departurePicker.redraw()
    this.updateDates()
  };

  AltitudeParkingWidget.prototype.departureDateChanged = function(date) {
    this.updateDates()
  };

  AltitudeParkingWidget.prototype.updateDates = function(arrDate, depDate) {
    arrDate = arrDate || this.arrivalPicker.selectedDates[0]
    depDate = depDate || this.departurePicker.selectedDates[0]

    
    

    //this.$departureTime.not(':input').text(flatpickr.formatDate(depDate, this.options.timeFormat))
    //this.$departureTime.val(flatpickr.formatDate(depDate, this.options.timeFormat))

    this.$arrivalDate.val(flatpickr.formatDate(arrDate, this.options.dateFormat))
    this.$departureDate.val(flatpickr.formatDate(depDate, this.options.dateFormat))

    this.$arrivalDow.text(flatpickr.formatDate(arrDate, this.options.dowFormat))
    this.$departureDow.text(flatpickr.formatDate(depDate, this.options.dowFormat))
  }

  AltitudeParkingWidget.prototype.onSubmit = function() {
    this.updateDates()
    return true;
  }

  AltitudeParkingWidget.init = function(slector, options) {
    $(slector || '[data-altitude-parking]').each(function(i, form){
      var widget = new AltitudeParkingWidget(form, options);
    })
  }

  window.AltitudeParkingWidget = AltitudeParkingWidget;

  // $(function() {

  //   $('[data-altitude-parking]').each(function(i, form){
  //     var widget = new AltitudeParkingWidget(form);

  //     if (window.parkingWidget == undefined)
  //       window.parkingWidget = widget;
  //   })

  // })

})(jQuery)
;
