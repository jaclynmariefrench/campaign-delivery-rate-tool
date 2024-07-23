import { ComponentLoader } from 'adminjs'

const componentLoader = new ComponentLoader()

const Components = {
    MyInput: componentLoader.add('MyInput', './my-input'),
    RatingRuleForm: componentLoader.add('RatingRuleForm', './ratingRuleForm'),
    ConditionBadge: componentLoader.add('ConditionBadge', './ConditionBadge'),
    ConditionShow: componentLoader.add('ConditionShow', './ConditionShow')
    // other custom components
}

export { componentLoader, Components }