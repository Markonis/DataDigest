module PresentationsHelper
  def group_options
    @groups.map do |g|
      [g.name, g.id]
    end
  end
  def presentation_title(presentation)
    if presentation.name.present?
      presentation.name
    else
      attribute_x = presentation.display_config[:attribute_x]
      attribute_y = presentation.display_config[:attribute_y]
      group_name = presentation.group_info[:name]
      "Dependancy between attributes #{attribute_x} and #{attribute_y} in #{group_name}"
    end
  end
end