import { ComponentLoader } from 'adminjs'
// import ResetPasswordForm from './resetPasswordForm'

const componentLoader = new ComponentLoader()

const Components = {
    MyInput: componentLoader.add('MyInput', './my-input'),
    RatingRuleForm: componentLoader.add('RatingRuleForm', './ratingRuleForm'),
    ConditionBadge: componentLoader.add('ConditionBadge', './ConditionBadge'),
    ConditionShow: componentLoader.add('ConditionShow', './ConditionShow'),
    ResetPasswordForm: componentLoader.add('ResetPasswordForm', './resetPasswordForm'),
    CustomLogin: componentLoader.add('CustomLogin', './CustomLogin')
    // other custom components
}

export { componentLoader, Components }